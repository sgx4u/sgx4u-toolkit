# Repository settings checklist

These settings cannot be committed as files. Do them in order. Nothing here publishes a package or changes the settings for you.

The GitHub owner is the personal account `sgx4u`. Where a team name would have been used, the setting is the user `@sgx4u`.

## 1. Branches

There is no `main`. Three long-lived branches stay protected, plus backport branches:

| Branch                       | Role                                                                                                                                                                                            |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `develop`                    | Default branch. Stable integration. Every change (patch, minor, or major) squash-merges here through a pull request. Pushes do not publish. Do not commit directly on `production`.             |
| `beta`                       | Experimental line. It may run ahead of `develop`. Experimental work may land here first. Pushes publish uncommitted Changesets snapshots on the npm `beta` dist-tag (`0.0.0-beta-<timestamp>`). |
| `production`                 | Stable releases. Promote `develop` into `production` with a rebase merge. Pushes publish `latest` after the Version Packages pull request.                                                      |
| `release/<package>/v<major>` | Older majors on the `previous` dist-tag. Patch and minor fixes only. Major (breaking) changes are never backported.                                                                             |

Create `beta` from `develop` before the first experiment. The workflows do not create that branch. Create `production` from `develop` when the first stable release is ready. Create `release/<package>/v<major>` only when the first backport for that older major is needed. That branch receives patch and minor fixes for the previous major. A major change stays on `develop` and is not cherry-picked there. Pull requests into `develop`, `beta`, `production`, and `release/**` run the same required checks.

### Why snapshots, not pre mode

`beta` publishes with `changeset version --snapshot beta`. The configured snapshot template is `{tag}-{timestamp}` and `useCalculatedVersion` is false, so the published version is `0.0.0-beta-<timestamp>`. Changesets turns `commit` off for snapshot runs, the workflow job has `contents: read`, and `scripts/publish-beta-snapshot.mjs` restores `package.json`, changelogs, and changesets before the job ends. The prerelease version never lands on the branch.

Pre mode (`changeset pre enter beta`) would commit `.changeset/pre.json` and versions such as `0.1.0-beta.0`. Those commits live on `beta`. A graduation pull request, or merging `beta` into `develop` by mistake, would carry them into `develop`. The rebase that promotes `develop` into `production` would then publish prereleases as `latest`.

### Keeping beta in sync with develop

Merge `develop` into `beta` with a merge commit, regularly, and again after every security fix:

1. `git fetch origin`
2. `git checkout -b sync/develop-into-beta origin/beta`
3. `git merge origin/develop`
4. Open a pull request into `beta` and merge it with **Create a merge commit**.

Squash and rebase do not make `develop`'s commits ancestors of `beta`. The next sync pull request would list those commits again and conflict. This is the same reason the consumed-changeset sync below does not use `production` as its head. A merge commit moves the merge base forward, so the next sync contains only what landed on `develop` since the last one. `beta` keeps the experimental commits that are not on `develop`.

### How a beta feature graduates

Open the graduation pull request from the feature branch into `develop`, not from `beta`.

1. Do the experiment on a feature branch and squash-merge it into `beta` so the snapshot publish includes it.
2. When it is ready for the stable line, rebase that feature branch onto `develop` and open a pull request into `develop`. Include the changeset.
3. Squash-merge it into `develop`.
4. Merge `develop` back into `beta` so the experimental line picks up the graduated copy.

`beta` contains every unfinished experiment and the sync merge commits. Merging that branch into `develop` would put all of it on the stable line. If the feature branch was already deleted, recreate the change on a new branch from `develop`. Still do not open the pull request from `beta`.

The next `develop` into `beta` merge can conflict on a feature that was squash-merged to both branches. Keep the `develop` side for that feature. The two copies are the same change.

After `production` publishes, `release.yml` opens a pull request into `develop` from a new `sync/consumed-changesets-*` branch. Squash-merge it before the next promotion. The head is not `production`. Squash merges do not record `production`'s commits as ancestors, so a pull request whose head is the long-lived release branch would list those commits again next time and conflict. The sync commit only deletes changeset files that `production` removed since the branches diverged. A changeset added on `develop` after promotion is not in that set. Left on `develop`, an already released changeset would be added again by a later rebase, and the next Version Packages pull request would release the same work twice. The following merge of `develop` into `beta` removes those consumed changesets from `beta` as well.

Settings → General → Pull Requests:

| Setting              | Value                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------- |
| Allow merge commits  | On. Used only to merge `develop` into `beta`. Feature pull requests are still squash-merged. |
| Allow squash merging | On. This is how feature pull requests enter `develop` and `beta`.                            |
| Allow rebase merging | On. This is how `develop` is promoted into `production`.                                     |
| Default branch       | `develop`                                                                                    |

## 2. Rulesets

Two rulesets. Protections apply to every long-lived branch. Linear history stays off `beta` so the `develop` merge commit can land.

### Protected branches

Settings → Rules → New ruleset, or edit the existing one. Target `develop`, `production`, `beta`, and `release/**`.

| Setting                         | Value                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------- |
| Enforcement                     | Active                                                                          |
| Restrict deletions              | On                                                                              |
| Block force pushes              | On                                                                              |
| Require a pull request          | On, 1 approval                                                                  |
| Require review from Code Owners | On                                                                              |
| Dismiss stale approvals         | On                                                                              |
| Require conversation resolution | On                                                                              |
| Require status checks           | `ci / lint`, `ci / typecheck`, `ci / test`, `ci / build`, `ci / package-checks` |
| Branches up to date             | On                                                                              |
| Bypass                          | Repository admin role, mode **For pull requests only**                          |

Do not turn on **Require linear history** in this ruleset. That rule lives in the next ruleset, which does not include `beta`.

If this ruleset already exists and targets only `develop`, `production`, and `release/**`, add `beta`. If it already requires linear history, turn that rule off here and add the ruleset below. Leaving linear history on `beta` blocks the merge commit, and squash or rebase cannot sync `develop` without replaying the same commits.

You are the only admin, so you can merge your own pull requests. GitHub will not let you approve them yourself. That is expected. The bypass still requires a pull request.

### Linear history

Settings → Rules → New ruleset. Target `develop`, `production`, and `release/**`. Do not include `beta`.

| Setting                | Value                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| Enforcement            | Active                                                                                        |
| Require linear history | On. Feature pull requests are squash-merged and `develop` is rebase-merged into `production`. |

`beta` is omitted on purpose. The sync from `develop` is a merge commit. Feature pull requests into `beta` are still squash-merged.

Optional extra checks once you trust them: `ci / test-node-22`, `ci / dependency-review`, `ci / pkg-pr-new`, `security / analyze`, `security / secrets`.

`package-checks` runs publint and `@arethetypeswrong/cli` after the build. Dependency review and the pkg.pr.new preview run only on pull requests, inside `ci.yml`. CodeQL and gitleaks live in `security.yml`, including a weekly schedule. The previous optional names `codeql / analyze`, `ci / secrets`, and `dependency-review / review` are replaced by the names above.

## 3. Actions permissions

Settings → Actions → General.

| Setting                                                  | Value                                                                      |
| -------------------------------------------------------- | -------------------------------------------------------------------------- |
| Actions permissions                                      | Allow all actions, or allow the pinned actions used in `.github/workflows` |
| Fork pull request workflows                              | Require approval for all external contributors                             |
| Workflow permissions                                     | Read repository contents                                                   |
| Allow GitHub Actions to create and approve pull requests | Off                                                                        |

The version pull request is opened by a GitHub App, not by `GITHUB_TOKEN`, so turning that last switch off does not block releases. It does stop a workflow from approving its own pull request.

## 4. Release GitHub App

Create a GitHub App owned by `@sgx4u`.

- Homepage: `https://github.com/sgx4u/sgx4u-toolkit`
- Webhook: off
- Repository permissions: Contents (read and write), Pull requests (read and write)
- Install it only on `sgx4u/sgx4u-toolkit`

Then:

- Repository variable `RELEASE_APP_ID`: the App's numeric id
- Repository secret `RELEASE_APP_PRIVATE_KEY`: the App private key PEM

`release.yml` mints an installation token from those in the version job. Without them, a push that contains changesets fails in that job on purpose.

## 5. `release` environment

Settings → Environments → New environment → `release`.

| Setting             | Value                                                                   |
| ------------------- | ----------------------------------------------------------------------- |
| Required reviewers  | Subhajit (`sgx4u`). Allow self-review, because there is one maintainer. |
| Deployment branches | Selected: `beta`, `production`, `release/*`                             |
| Environment secrets | None                                                                    |

The publish job and the beta snapshot job are the jobs with `id-token: write`. Approving the environment is the publish gate. `develop` is not a deployment branch: it does not publish. Replace `develop` with `beta` on an environment that already lists `develop`.

## 6. npm trusted publishing

For each package, after its `0.1.0` exists on npm:

1. Publish `0.1.0` locally with npm CLI 11.5.1 or newer and 2FA: `npm publish --access public` from the package directory. Provenance is optional for this one local publish.
2. Attach the trusted publisher. On the package's npm page, or with `npm trust github --repo sgx4u/sgx4u-toolkit --file release.yml --env release --allow-publish`.
3. Cancel the GitHub `release` run that is waiting to publish that same version. Approving it would try to publish `0.1.0` again.
4. Turn off token publishing for the package if npm offers that switch. Do not create an `NPM_TOKEN` secret.

The packages in the first changeset are `@sgx4u/tsconfig`, `@sgx4u/eslint-config`, `@sgx4u/prettier-config`, `@sgx4u/tsdown-config`, `@sgx4u/vitest-config`, and `@sgx4u/string`.

The account that owns `@sgx4u` on npm should have 2FA.

## 7. Secret scanning, Dependabot, Discussions

Settings → Code security:

- Dependency graph: on. Enable it under Settings → Code security → Dependency graph. Until it is on, `ci / dependency-review` returns 403 from the dependency review API.
- Dependabot alerts: on
- Dependabot security updates: on if you want security pull requests as well as the weekly Actions updates
- Secret scanning: on
- Secret scanning push protection: on
- Private vulnerability reporting: on
- Code scanning: the `security` workflow uploads CodeQL results. If GitHub's default CodeQL setup is also enabled, turn the default setup off so two analyses do not fight over the same category.

Settings → General → Features:

- Discussions: on
- Issues: on

## 8. Optional remote cache

Vercel remote cache is optional. CI uses it only when all three values are set. Fork pull requests do not receive them.

| Name                               | Kind     | Value                                                       |
| ---------------------------------- | -------- | ----------------------------------------------------------- |
| `TURBO_TOKEN`                      | Secret   | Token from `turbo login` / the Vercel team                  |
| `TURBO_TEAM`                       | Variable | Team slug                                                   |
| `TURBO_REMOTE_CACHE_SIGNATURE_KEY` | Secret   | At least 32 bytes of random data. `openssl rand -base64 32` |

`turbo.json` sets `remoteCache.signature` so cached artifacts are signed. A missing key turns the remote cache off for that run. Local builds do not need it.

## 9. pkg.pr.new

Install the [pkg.pr.new GitHub App](https://github.com/apps/pkg-pr-new) on this repository. The `pkg-pr-new` job in `ci.yml` then comments an install command on the pull request. The preview is not an npm publish.

## 10. Renovate

Dependabot updates GitHub Actions only (`dependabot.yml`). npm updates belong to Renovate (`renovate.json`), including the catalog in `pnpm-workspace.yaml`. The npm manager reads that file by default. Renovate opens pull requests against `develop` only (`baseBranchPatterns`). `beta` is not a base branch. A second lockfile stream would conflict every time `develop` is merged in. Dependency updates reach experimental builds through that merge.

The config extends `config:recommended` and sets `automerge` to false. Dependency pull requests are reviewed and merged like any other pull request. There is no `@sgx4u/**` group: packages in this repository depend on each other with `workspace:*` or `workspace:^`, and Renovate does not update those.

Renovate waits 3 days after a release before opening an update (`minimumReleaseAge`). That is the window in which npm still allows a publish to be unpublished. It runs weekly, before 5am on Monday. Non-major updates share one pull request. Major updates are not in that pull request. Lockfile maintenance uses the same weekly schedule. GitHub Actions stay disabled here because Dependabot opens those.

## 11. Two-factor authentication

Turn on 2FA for the GitHub account `sgx4u` and for the npm account that publishes `@sgx4u`.
