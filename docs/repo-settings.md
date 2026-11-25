# Repository settings

Configure these in GitHub and npm, in order. The files in this repository record the intended settings.

The GitHub owner is the user `@sgx4u`.

## 1. Branches

| Branch                       | Role                                                                                                                          |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `develop`                    | Default branch. Stable integration. Every change squash-merges here through a pull request.                                   |
| `beta`                       | Experimental line. It may run ahead of `develop`. Pushes publish uncommitted Changesets snapshots on the npm `beta` dist-tag. |
| `production`                 | Stable releases. Promote `develop` with a rebase merge. Pushes publish `latest` after the Version Packages pull request.      |
| `release/<package>/v<major>` | Older majors on the `previous` dist-tag. Patch and minor fixes.                                                               |

Create `beta` yourself from `develop` before the first experiment. Create `production` from `develop` when the first stable release is ready. Create `release/<package>/v<major>` when the first backport for that older major is needed. Pull requests into `develop`, `beta`, `production`, and `release/**` run the same required checks.

`beta` publishes with `changeset version --snapshot beta`. The snapshot template is `{tag}-{timestamp}` and `useCalculatedVersion` is false, so the published version is `0.0.0-beta-<timestamp>`. The snapshot job has `contents: read`, and `scripts/publish-beta-snapshot.mjs` restores the checkout. The reason snapshots stay uncommitted is in [ADR 0001](./adr/0001-public-toolkit-monorepo.md).

### Keeping beta in sync

Merge `develop` into `beta` with a merge commit, on a regular cadence and after every security fix:

1. `git fetch origin`
2. `git checkout -b sync/develop-into-beta origin/beta`
3. `git merge origin/develop`
4. Open a pull request into `beta` and merge it with **Create a merge commit**.

A merge commit moves the merge base forward, so the next sync contains the commits that landed on `develop` since the last one. `beta` keeps the experimental commits that are only on `beta`. Use a merge commit so those `develop` commits stay ancestors. The same ancestry rule is why the consumed-changeset sync below uses a fresh branch. See [ADR 0001](./adr/0001-public-toolkit-monorepo.md).

### Graduating a beta feature

The steps are in [CONTRIBUTING](../CONTRIBUTING.md#branches). The graduation pull request comes from the feature branch. `beta` contains every unfinished experiment and the sync merge commits.

The next `develop` into `beta` merge can conflict where the same feature was squash-merged to both branches. Keep the `develop` side. The two copies are the same change.

### Consumed changesets

After `production` publishes, `release.yml` opens a pull request into `develop` from `sync/consumed-changesets-*`. Squash-merge it before the next promotion. The commit deletes changeset files that `production` removed since the branches diverged. A changeset added on `develop` after promotion stays. The following merge of `develop` into `beta` drops those consumed changesets from `beta` as well.

### Pull request settings

Settings → General → Pull Requests:

| Setting              | Value                                                                             |
| -------------------- | --------------------------------------------------------------------------------- |
| Allow merge commits  | On. Used to merge `develop` into `beta`. Feature pull requests are squash-merged. |
| Allow squash merging | On. Feature pull requests enter `develop` and `beta` this way.                    |
| Allow rebase merging | On. `develop` is promoted into `production` this way.                             |
| Default branch       | `develop`                                                                         |

## 2. Rulesets

Two rulesets. The protected-branch ruleset covers every long-lived branch. Linear history stays off `beta` so the `develop` merge commit can land.

### Protected branches

Settings → Rules → New ruleset. Target `develop`, `production`, `beta`, and `release/**`.

| Setting                           | Value                                                                           |
| --------------------------------- | ------------------------------------------------------------------------------- |
| Enforcement                       | Active                                                                          |
| Restrict deletions                | On                                                                              |
| Block force pushes                | On                                                                              |
| Require a pull request            | On, 1 approval                                                                  |
| Require review from Code Owners   | On                                                                              |
| Dismiss stale approvals           | On                                                                              |
| Require conversation resolution   | On                                                                              |
| Require status checks             | `ci / lint`, `ci / typecheck`, `ci / test`, `ci / build`, `ci / package-checks` |
| Require branches to be up to date | On                                                                              |
| Bypass                            | Repository admin role, mode **For pull requests only**                          |

Leave **Require linear history** off in this ruleset. That rule is the next ruleset, which omits `beta`.

With one admin, merge your own pull requests through the bypass. GitHub still requires the pull request.

### Linear history

Settings → Rules → New ruleset. Target `develop`, `production`, and `release/**`.

| Setting                | Value                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| Enforcement            | Active                                                                                         |
| Require linear history | On. Feature pull requests are squash-merged, and `develop` is rebase-merged into `production`. |

`beta` is omitted so the sync from `develop` can be a merge commit. Feature pull requests into `beta` are still squash-merged.

Optional checks to require once you trust them: `ci / test-node-22`, `ci / dependency-review`, `ci / pkg-pr-new`, `security / analyze`, `security / secrets`.

`ci / package-checks` runs `check:package` (publint and `@arethetypeswrong/cli`; the task depends on `build`), then `scripts/check-pack.mjs`. Pull requests also run `changeset status`. Dependency review and the pkg.pr.new preview run on pull requests, in `ci.yml`. CodeQL (`security / analyze`) and gitleaks (`security / secrets`) run from `security.yml`, including a weekly schedule.

## 3. Actions permissions

Settings → Actions → General.

| Setting                                                  | Value                                                                      |
| -------------------------------------------------------- | -------------------------------------------------------------------------- |
| Actions permissions                                      | Allow all actions, or allow the pinned actions used in `.github/workflows` |
| Fork pull request workflows                              | Require approval for all external contributors                             |
| Workflow permissions                                     | Read repository contents                                                   |
| Allow GitHub Actions to create and approve pull requests | Off                                                                        |

The version pull request is opened by the release GitHub App, so that last switch stays off.

## 4. Release GitHub App

Create a GitHub App owned by `@sgx4u`.

- Homepage: `https://github.com/sgx4u/sgx4u-toolkit`
- Webhook: off
- Repository permissions: Contents (read and write), Pull requests (read and write)
- Install it on `sgx4u/sgx4u-toolkit`

Then:

- Repository variable `RELEASE_APP_ID`: the App's numeric id
- Repository secret `RELEASE_APP_PRIVATE_KEY`: the App private key PEM

`release.yml` mints an installation token from those in the version job and the consumed-changeset job. A push that contains changesets fails in the version job when they are missing.

## 5. `release` environment

Settings → Environments → New environment → `release`.

| Setting             | Value                                       |
| ------------------- | ------------------------------------------- |
| Required reviewers  | `@sgx4u`. Allow self-review.                |
| Deployment branches | Selected: `beta`, `production`, `release/*` |
| Environment secrets | None                                        |

The publish job and the beta snapshot job use this environment and `id-token: write`. Approving the environment is the publish gate.

On `production` and `release/**`, the publish job installs with a frozen lockfile, builds, reviews packed files, and runs `scripts/publish-packages.mjs`. `production` uses the `latest` dist-tag. `release/**` uses `previous`. The script publishes libraries under `packages/<name>` and leaves presets in `packages/config` unpublished. npm trusted publishing uses the job's OIDC token. Do not set `registry-url` on `actions/setup-node` and do not create an `NPM_TOKEN` secret: `registry-url` writes an empty `_authToken`, and npm then skips the trusted publisher. The same job creates GitHub releases and pushes git tags for the libraries it published. The workflow file stays `release.yml` and the environment stays `release`, because the trusted publisher is bound to that file and environment.

The version job holds the release GitHub App token and does not have `id-token: write`. The publish job has the OIDC token and does not have the App token. Pull requests do not run this workflow.

`beta` publishes only when a changeset file is present, so an empty push does not request this environment. The snapshot job has `contents: read`. `scripts/publish-beta-snapshot.mjs` versions with `changeset version --snapshot beta`, publishes libraries whose versions changed, and restores the checkout.

## 6. npm trusted publishing

For `@sgx4u/string`, publish `0.1.0` once from a laptop so npm can attach a trusted publisher. Later versions are published by `release.yml`. Presets in `packages/config` are not published.

1. Let the Version Packages pull request bump the package to `0.1.0`, or check out that commit. `develop` leaves the changeset in git. `beta` publishes an uncommitted snapshot and also leaves the changeset in git.
2. From the package directory, with npm CLI 11.5.1 or newer and 2FA: `npm publish --access public`.
3. Attach the trusted publisher. On the package's npm page, or with `npm trust github --repo sgx4u/sgx4u-toolkit --file release.yml --env release --allow-publish`.
4. Cancel the GitHub `release` run that is waiting to publish that same version.
5. Turn off token publishing when npm shows that switch. CI uses the trusted publisher. Add no `NPM_TOKEN` secret.

The published library is `@sgx4u/string`.

Turn on 2FA for the npm account that owns `@sgx4u`.

## 7. Code security

Settings → Code security:

- Dependency graph: on. `ci / dependency-review` calls that API.
- Dependabot alerts: on
- Dependabot security updates: on, so GitHub opens security pull requests along with the weekly Actions updates
- Secret scanning: on
- Secret scanning push protection: on
- Private vulnerability reporting: on
- Code scanning: the `security` workflow uploads CodeQL results. Leave GitHub's default CodeQL setup off so one analysis owns the category.

Settings → General → Features:

- Discussions: off. Questions use the blank issue form. The issue config does not link to Discussions.
- Issues: on

Issue forms live in `.github/ISSUE_TEMPLATE`. `blank_issues_enabled` is false, so a new issue starts from a form: bug report, documentation, feature request, or blank. Report a vulnerability through the private advisory link in that config.

Labels the forms apply: `bug`, `documentation`, `feature`, `unclassified`. `bug` and `documentation` already exist. Create `feature` and `unclassified` so a form can apply them.

`.github/FUNDING.yml` is read from the default branch. It lists GitHub Sponsors for `@sgx4u` and `https://razorpay.me/@sgx4u`. The Sponsors button appears when GitHub Sponsors is enabled on the `@sgx4u` account. The Razorpay link appears from the file.

## 8. Remote cache

Vercel remote cache is optional. CI uses it when all three values are set. Fork pull requests receive none of them.

| Name                               | Kind     | Value                                                       |
| ---------------------------------- | -------- | ----------------------------------------------------------- |
| `TURBO_TOKEN`                      | Secret   | Token from `turbo login` / the Vercel team                  |
| `TURBO_TEAM`                       | Variable | Team slug                                                   |
| `TURBO_REMOTE_CACHE_SIGNATURE_KEY` | Secret   | At least 32 bytes of random data. `openssl rand -base64 32` |

`turbo.json` sets `remoteCache.signature`. A run without the signature key leaves the remote cache off. Local builds can omit it.

## 9. pkg.pr.new

Install the [pkg.pr.new GitHub App](https://github.com/apps/pkg-pr-new) on this repository. The `pkg-pr-new` job in `ci.yml` then comments an install command on the pull request. The preview is separate from an npm publish.

## 10. Renovate

Dependabot (`dependabot.yml`) updates GitHub Actions and targets `develop`. Renovate (`renovate.json`) updates npm dependencies, including the catalog in `pnpm-workspace.yaml`, and its `baseBranchPatterns` is `develop`. Experimental builds receive those updates when `develop` is merged into `beta`.

The config extends `config:recommended`. `automerge` is false, so dependency pull requests are reviewed like any other pull request. Workspace ranges (`workspace:*` and `workspace:^`) stay as written. Renovate updates registry versions.

Renovate waits 3 days after a release before opening an update (`minimumReleaseAge`). That is the window in which npm still allows a publish to be unpublished. It runs weekly, before 5am on Monday. Non-major updates share one pull request. Major updates get their own pull requests. Lockfile maintenance uses the same weekly schedule. The github-actions manager is disabled here because Dependabot opens those updates.

## 11. Two-factor authentication

Turn on 2FA for the GitHub account `sgx4u` and for the npm account that publishes `@sgx4u`.
