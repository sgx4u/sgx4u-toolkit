# sgx4u-toolkit

Public Turborepo of shared non-UI [`@sgx4u`](https://www.npmjs.com/search?q=%40sgx4u) packages.

UI packages live in [sgx4u-ui](https://github.com/sgx4u/sgx4u-ui). This repository never depends on them, and it never depends on a private scope.

[![ci](https://github.com/sgx4u/sgx4u-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/sgx4u/sgx4u-toolkit/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D22.12-339933.svg)](./package.json)
[![npm @sgx4u/string](https://img.shields.io/npm/v/@sgx4u/string.svg)](https://www.npmjs.com/package/@sgx4u/string)

## Packages

| Package                                                        | Domain     | What it is                             |
| -------------------------------------------------------------- | ---------- | -------------------------------------- |
| [`@sgx4u/tsconfig`](./domains/platform/tsconfig)               | platform   | TypeScript presets                     |
| [`@sgx4u/eslint-config`](./domains/platform/eslint-config)     | platform   | ESLint flat config and boundaries      |
| [`@sgx4u/prettier-config`](./domains/platform/prettier-config) | platform   | Prettier preset                        |
| [`@sgx4u/tsdown-config`](./domains/platform/tsdown-config)     | platform   | tsdown preset for ESM libraries        |
| [`@sgx4u/vitest-config`](./domains/platform/vitest-config)     | platform   | Vitest preset                          |
| [`@sgx4u/string`](./domains/foundation/string)                 | foundation | Blank checks and whitespace collapsing |

`domains/backend` is reserved for server adapters. None are published yet.

Packages are ESM-only, built with tsdown, and declare `"node": ">=22.12"`. Inside this repo, runtime dependencies use `workspace:^` and dev tooling uses `workspace:*`. Third-party versions live in the pnpm catalog.

## Usage

```sh
pnpm add @sgx4u/string
```

```ts
import { collapseWhitespace, isBlank } from "@sgx4u/string";

isBlank("  ");
collapseWhitespace("  a \n b  ");
```

The `@sgx4u/source` export condition points at TypeScript source. Apps in this workspace resolve it through `customConditions`. Published installs use `dist`.

## Development

Install Node 24 (`.nvmrc`) and pnpm 11.25. The package manager is pinned in `package.json`.

```sh
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Create a package:

```sh
pnpm exec turbo gen package
```

The generator asks for the name, domain, tier, runtime, and owner, then writes the package, a changeset, and a CODEOWNERS line. Web and native packages belong in sgx4u-ui, so this generator does not offer those runtimes.

Add a changeset on every pull request that changes a publishable package:

```sh
pnpm changeset
```

Versions are independent. `updateInternalDependencies` is `minor`, so a minor bump of a dependency also updates the packages that depend on it.

## Releases

Feature pull requests squash-merge into `develop`. `develop` is promoted into `production` with a rebase merge. There is no `main` branch.

Pushes to `develop`, `production`, and `release/**` run [`.github/workflows/release.yml`](./.github/workflows/release.yml).

- `develop` publishes Changesets snapshots to the `beta` dist-tag. Those version numbers are not committed. Snapshot is used instead of pre mode because a committed pre-mode file would ride the rebase into `production` and publish prereleases as `latest`.
- `production` opens a **Version Packages** pull request through a GitHub App, so CI runs on it. Merging that pull request publishes `latest` from the `release` environment with npm trusted publishing (OIDC) and provenance. The workflow then opens a pull request from a new `sync/consumed-changesets-*` branch into `develop`. Squash-merge it before the next promotion. The head is not `production`: develop only squash-merges, so a pull request from the long-lived release branch would not record those commits as ancestors, and the next release would open the same pairing again and conflict. The sync commit only deletes changeset files production already released, so a later rebase does not add them a second time.
- `release/**` publishes older majors on the `previous` dist-tag. Pull requests into those branches run the same required checks.

The first version of a new package is published from a laptop. npm can attach a trusted publisher only after the package exists. Later versions are published only by the workflow. See [docs/repo-settings.md](./docs/repo-settings.md).

Pull requests can install preview tarballs from pkg.pr.new. Those previews are not npm releases.

## Repository map

```text
domains/platform     presets, dev dependencies only
domains/foundation   platform-free TypeScript
domains/backend      server adapters
turbo/generators     pnpm exec turbo gen package
scripts              visibility, link, and pack guards
docs                 settings checklist and decisions
```

Dependency direction is downward only: adapters may use foundation, foundation does not use adapters, and nothing here uses UI. `turbo boundaries` and ESLint both enforce that. A separate check rejects any `@sgx4u-private` or `@sgx4u/ui*` reference in manifests and source.

## License

[MIT](./LICENSE) © 2026 Subhajit Ghosh
