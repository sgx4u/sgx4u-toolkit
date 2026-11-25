# ADR 0001: Public toolkit monorepo

## Status

Accepted. 25 November 2026.

## Context

Shared packages need one place to version, test, and publish. The repository was created with `create-turbo`, which added two Next.js apps and a private `@repo/ui` package. That starter is a demo. Those files were removed. This repository publishes libraries and tooling presets only.

The GitHub owner is the personal account `sgx4u`. There is no `sgx4u` organization, so CODEOWNERS cannot mention a team.

The plan pins TypeScript `~6.0.3` and treats TypeScript 7 as a later, separate upgrade. The create-turbo commit had already resolved TypeScript 7.0.2. This repository follows the plan's pin so that upgrade stays one tracked change.

## Decision

- One public pnpm workspace. Tooling presets live in `packages/config`. Every other package lives in `packages/<name>`.
- The Next.js starter apps and `@repo/ui` are removed.
- Nothing in this repository references `@sgx4u-private` or a private registry. CI rejects those references.
- Config presets in `packages/config` are public packages. Sibling repositories install them from npm. Inside this repo they are `workspace:*` dev dependencies. They do not depend on packages under `packages/`.
- Runtime dependencies between packages use `workspace:^`.
- Libraries are built with tsdown and publish both ESM and CommonJS. Published packages declare `node >= 22.12`. Development and CI use Node 24.
- A library picks one runtime: `universal`, `edge`, or `node`. Boundaries, ESLint, and the TypeScript preset all follow that choice. See [docs/runtimes.md](../runtimes.md).
- Releases use Changesets (independent versions, public access, `updateInternalDependencies: minor`) and npm trusted publishing from `release.yml` in the `release` environment.
- CODEOWNERS entries are `@sgx4u`.
- `@sgx4u/string` is the first library package so the task graph, tests, publint, and attw have something real to run. Further packages are added with `turbo gen package`.

## Consequences

- A change that crosses several packages can land in one pull request.
- The first `0.1.0` of each package is published from a laptop. npm cannot attach a trusted publisher before the package exists. Later versions come from CI, with provenance, and no npm write token is stored.
- `develop` stays the default branch and the stable integration branch. It does not publish. `production` is the stable release branch. `beta` is the experimental branch and publishes uncommitted Changesets snapshots (`0.0.0-beta-<timestamp>`), so a prerelease version is never committed and cannot ride into `develop` or `production`. There is no `main`. Changesets uses `develop` as `baseBranch`. Revised November 2026: snapshots moved off `develop` onto `beta`.
- A later folder move leaves the published name `@sgx4u/<name>` unchanged.
