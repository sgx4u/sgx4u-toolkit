# ADR 0001: Public toolkit monorepo

## Status

Accepted. 25 November 2026.

## Context

Shared non-UI packages need one place to version, test, and publish. The repository was created with `create-turbo`, which added two Next.js apps and a private `@repo/ui` package. That starter is a demo. The architecture plan puts UI in `sgx4u-ui` and keeps this repository public.

The GitHub owner is the personal account `sgx4u`. There is no `sgx4u` organization, so CODEOWNERS cannot mention a team.

The plan pins TypeScript `~6.0.3` and treats TypeScript 7 as a later, separate upgrade. The create-turbo commit had already resolved TypeScript 7.0.2. This repository follows the plan's pin so that upgrade stays one tracked change.

## Decision

- One public pnpm workspace. Tooling presets live in `packages/config`. Every other package lives in `packages/<name>`.
- The Next.js starter apps and `@repo/ui` are removed. UI stays in `sgx4u-ui`.
- Nothing in this repository references `@sgx4u-private` or a private registry. CI rejects those references, and it rejects `@sgx4u/ui*`.
- Platform presets are public packages. Sibling repositories install them from npm. Inside this repo they are `workspace:*` dev dependencies.
- Runtime dependencies between packages use `workspace:^`.
- Libraries are built with tsdown and publish both ESM and CommonJS. Published packages declare `node >= 22.12`. Development and CI use Node 24.
- Releases use Changesets (independent versions, public access, `updateInternalDependencies: minor`) and npm trusted publishing from `release.yml` in the `release` environment.
- CODEOWNERS entries are `@sgx4u`.
- `@sgx4u/string` is the first foundation package so the task graph, tests, publint, and attw have something real to run. Further packages are added with `turbo gen package`.

## Consequences

- A change that crosses foundation and backend can land in one pull request.
- The first `0.1.0` of each package is published from a laptop. npm cannot attach a trusted publisher before the package exists. Later versions come from CI, with provenance, and no npm write token is stored.
- `develop` stays the default branch. `production` is the stable release branch. There is no `main`. Changesets uses `develop` as `baseBranch`. `develop` publishes beta snapshots so a rebase into `production` does not carry pre-mode state.
- A later folder move leaves the published name `@sgx4u/<name>` unchanged.
