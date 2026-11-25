# Repository settings checklist

These settings cannot be committed as files. Do them in order. Nothing here publishes a package or changes the settings for you.

The GitHub owner is the personal account `sgx4u`. Where a team name would have been used, the setting is the user `@sgx4u`.

## 1. Branches

There is no `main`. Two long-lived branches stay protected:

| Branch       | Role                                                                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `develop`    | Default branch. Feature pull requests squash-merge here. Pushes publish Changesets snapshots on the npm `beta` dist-tag.                   |
| `production` | Stable releases. Promote `develop` into `production` with a rebase merge. Pushes publish `latest` after the Version Packages pull request. |

Create `production` from `develop` when the first stable release is ready. Create `release/<package>/v<major>` only when the first backport for that older major is needed. Those branches publish the `previous` dist-tag. Pull requests into them run the same required checks as `develop` and `production`.

After `production` publishes, `release.yml` opens a pull request into `develop` from a new `sync/consumed-changesets-*` branch. Squash-merge it before the next promotion. The head is not `production`. Squash merges do not record `production`'s commits as ancestors, so a pull request whose head is the long-lived release branch would list those commits again next time and conflict. The sync commit only deletes changeset files that `production` already released. Left on `develop`, a later rebase would add them again and the next Version Packages pull request would release the same work twice.

Settings → General → Pull Requests:

| Setting              | Value                                                    |
| -------------------- | -------------------------------------------------------- |
| Allow merge commits  | Off                                                      |
| Allow squash merging | On. This is how feature pull requests enter `develop`.   |
| Allow rebase merging | On. This is how `develop` is promoted into `production`. |
| Default branch       | `develop`                                                |

## 2. Ruleset

Settings → Rules → New ruleset. Target `develop`, `production`, and `release/**`.

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
| Require linear history          | On. Squash and rebase are the only merge methods, so history stays linear.      |
| Bypass                          | Repository admin role, mode **For pull requests only**                          |

You are the only admin, so you can merge your own pull requests. GitHub will not let you approve them yourself. That is expected. The bypass still requires a pull request.

Optional extra checks once you trust them: `ci / test-node-22`, `ci / secrets`, `codeql / analyze`, `dependency-review / review`.

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
| Deployment branches | Selected: `develop`, `production`, `release/*`                          |
| Environment secrets | None                                                                    |

The publish job is the only job with `id-token: write`. Approving the environment is the publish gate.

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

- Dependency graph: on. Enable it under Settings → Code security → Dependency graph. Until it is on, `dependency-review / review` returns 403 from the dependency review API.
- Dependabot alerts: on
- Dependabot security updates: on if you want security pull requests as well as the weekly Actions updates
- Secret scanning: on
- Secret scanning push protection: on
- Private vulnerability reporting: on
- Code scanning: the `codeql` workflow uploads results. If GitHub's default CodeQL setup is also enabled, turn the default setup off so two analyses do not fight over the same category.

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

Install the [pkg.pr.new GitHub App](https://github.com/apps/pkg-pr-new) on this repository. `preview.yml` then comments an install command on the pull request. The preview is not an npm publish.

## 10. Renovate

Dependabot updates GitHub Actions only (`dependabot.yml`). npm updates belong to Renovate (`renovate.json`).

If Renovate runs from `sgx4u-devops`, point that job at this repository. The checked-in config groups `@sgx4u/**` minor and patch updates and turns automerge on for that group. Majors stay for review. This file does not mention a private scope.

Automerge needs the ruleset to allow it, or the Renovate app to be a bypass. With a required code-owner review, automerge will wait until that review exists. On a personal account that is you.

## 11. Two-factor authentication

Turn on 2FA for the GitHub account `sgx4u` and for the npm account that publishes `@sgx4u`.
