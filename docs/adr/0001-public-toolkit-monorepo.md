# ADR 0001: Public toolkit monorepo

## Status

Accepted. 25 November 2026.

## Context

Shared `@sgx4u` packages need one public place to version, test, and publish. The GitHub owner is the user `sgx4u`. The TypeScript catalog pin is `~6.0.3`. A move to TypeScript 7 is a separate upgrade.

## Decision

- One public pnpm workspace. Tooling presets live in `packages/config`. Every other package lives in `packages/<name>`.
- Libraries in `packages/<name>` publish to the public npm registry under `@sgx4u`. Presets in `packages/config` support those libraries inside this repository and are not published. Inside this repo the presets are `workspace:*` dev dependencies.
- `layout:config` is the preset tag and denies `layout:package`. `layout:package` is the library tag and may depend on presets and on other libraries. Runtime tags restrict that further. See [Runtimes](../runtimes.md).
- A runtime dependency between packages uses `workspace:^`.
- Libraries are built with tsdown and publish ESM and CommonJS. Published packages declare `node >= 22.12`. Development and CI use Node 24.
- A library picks one runtime: `universal`, `edge`, or `node`. Boundaries, ESLint, and the TypeScript preset follow that choice.
- Releases use Changesets: independent versions, public access, `updateInternalDependencies: minor`, and `baseBranch: develop`. npm trusted publishing runs from `.github/workflows/release.yml` in the `release` environment.
- `develop` is the default branch and the stable integration branch. `production` is the stable release branch. `develop` is rebase-merged into `production`, and that publishes the `latest` dist-tag. `beta` is the experimental branch. `release/<package>/v<major>` publishes the `previous` dist-tag for patch and minor fixes.
- `beta` publishes with `changeset version --snapshot beta`. `useCalculatedVersion` is false and `prereleaseTemplate` is `{tag}-{timestamp}`, so the version is `0.0.0-beta-<timestamp>`. Changesets leaves commits off for a snapshot run. The snapshot job has `contents: read`, and `scripts/publish-beta-snapshot.mjs` restores the worktree. The prerelease version stays off the branch. A graduation onto `develop` carries the source change and the changeset, and `production` publishes a stable version. Pre mode would commit `.changeset/pre.json` and prerelease versions on `beta`. A graduation pull request could carry those commits onto `develop`, and the rebase into `production` would publish them as `latest`.
- Feature pull requests are squash-merged. `develop` is merged into `beta` with a merge commit. A squash would leave `develop` off the ancestry of `beta`, and the next sync would replay the same commits. Linear history is required on `develop`, `production`, and `release/**`, and omitted on `beta`, so that merge commit can land.
- After `production` publishes, the consumed-changeset sync is a new branch, `sync/consumed-changesets-*`, containing only the deletion of changeset files `production` removed since the branches diverged. That branch squash-merges into `develop`. A pull request whose head is `production` would list the already applied commits again, because squash merges do not record them as ancestors.
- CODEOWNERS entries are `@sgx4u`.
- Further libraries are added with `pnpm exec turbo gen package`. `@sgx4u/string` is the library the task graph, tests, publint, and attw run against.

## Consequences

- A change that crosses several packages can land in one pull request.
- The first `0.1.0` of `@sgx4u/string` is published from a laptop, because npm attaches a trusted publisher after the package exists. Later versions come from CI with trusted publishing and provenance.
- The published name stays `@sgx4u/<name>` when the folder moves.
