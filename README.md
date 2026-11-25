# sgx4u-toolkit

Public Turborepo of shared [`@sgx4u`](https://www.npmjs.com/search?q=%40sgx4u) packages.

[![ci](https://github.com/sgx4u/sgx4u-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/sgx4u/sgx4u-toolkit/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D22.12-339933.svg)](./packages/string/package.json)
[![npm @sgx4u/string](https://img.shields.io/npm/v/@sgx4u/string.svg)](https://www.npmjs.com/package/@sgx4u/string)

## Packages

| Package                                                       | What it is                             |
| ------------------------------------------------------------- | -------------------------------------- |
| [`@sgx4u/tsconfig`](./packages/config/tsconfig)               | TypeScript presets                     |
| [`@sgx4u/eslint-config`](./packages/config/eslint-config)     | ESLint flat config and import rules    |
| [`@sgx4u/prettier-config`](./packages/config/prettier-config) | Prettier preset                        |
| [`@sgx4u/tsdown-config`](./packages/config/tsdown-config)     | tsdown preset for ESM and CommonJS     |
| [`@sgx4u/vitest-config`](./packages/config/vitest-config)     | Vitest preset                          |
| [`@sgx4u/string`](./packages/string)                          | Blank checks and whitespace collapsing |

Tooling presets live in `packages/config`. Libraries live in `packages/<name>`.

Published packages build with tsdown, ship ESM and CommonJS, and declare `"node": ">=22.12"`. `import` resolves `dist/*.js` with `dist/*.d.ts`. `require` resolves `dist/*.cjs` with `dist/*.d.cts`. The `@sgx4u/source` export condition points at TypeScript source. This workspace resolves it through `customConditions`. A published install uses `dist`.

Inside this repo, a runtime dependency on another toolkit package uses `workspace:^`. Dev dependencies use `workspace:*`. Third-party versions live in the pnpm catalog in `pnpm-workspace.yaml`. Add a catalog entry when a package needs that dependency.

The root workspace package is `@sgx4u/toolkit`. Its manifest is `"private": false` and it has no `version`. `scripts/check-pack.mjs` skips that name, so the workspace package stays out of the npm publish.

## Runtimes

Each library picks one runtime. Presets in `packages/config` are Node tooling, tagged `layout:config`, and installed as dev dependencies.

| Runtime     | Choose it when                                                                                                     | It may depend on                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| `universal` | The same source runs in browsers, workers, and Node, using web standards.                                          | Universal packages, and presets.                      |
| `edge`      | The code targets an edge runtime and may use web standards plus the Workers `nodejs_compat` modules that are real. | Universal packages, other edge packages, and presets. |
| `node`      | The code needs Node itself: processes, the full filesystem, or another API outside the edge subset.                | Universal, edge, and node packages, and presets.      |

`turbo boundaries` enforces that table. `@sgx4u/eslint-config` enforces the imports. `pnpm exec turbo gen package` writes the matching TypeScript preset, tsdown config, and Vitest config. The rules are in [docs/runtimes.md](./docs/runtimes.md).

## Usage

```sh
pnpm add @sgx4u/string
```

```ts
import { collapseWhitespace, isBlank } from "@sgx4u/string";

isBlank("  ");
collapseWhitespace("  a \n b  ");
```

## Development

Install Node 24 (`.nvmrc`) and pnpm 11.25.0 (the `packageManager` field in `package.json`).

```sh
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm check
```

| Command             | What it runs                                                                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm lint`         | Package lint tasks, then root ESLint. The root config ignores `packages/**`, so package sources are linted once.                                                   |
| `pnpm typecheck`    | Package typecheck tasks, then `tsc --noEmit` for the generator.                                                                                                    |
| `pnpm test`         | Package tests, then `node --test` on `scripts/*.test.mjs`.                                                                                                         |
| `pnpm build`        | `turbo run build`.                                                                                                                                                 |
| `pnpm check`        | `turbo boundaries`, sherif, `scripts/check-visibility.mjs`, `scripts/check-links.mjs`, `turbo run check:package` (publint and attw), and `scripts/check-pack.mjs`. |
| `pnpm format:check` | Prettier. `pnpm format` writes the same format.                                                                                                                    |

`pnpm changeset` runs the Changesets CLI. Contribution rules are in [CONTRIBUTING.md](./CONTRIBUTING.md).

## Releases

| Branch                       | Role                                                                 | npm dist-tag                                       |
| ---------------------------- | -------------------------------------------------------------------- | -------------------------------------------------- |
| `develop`                    | Default branch. Stable integration. Pull requests squash-merge here. | Integration only.                                  |
| `beta`                       | Experimental line. It can move ahead of `develop`.                   | `beta`, snapshots `0.0.0-beta-<timestamp>`.        |
| `production`                 | Stable releases. Promote `develop` with a rebase merge.              | `latest`, after the Version Packages pull request. |
| `release/<package>/v<major>` | Patch and minor fixes for an older major.                            | `previous`.                                        |

Pushes to `beta`, `production`, and `release/**` run [`.github/workflows/release.yml`](./.github/workflows/release.yml).

- `beta` publishes with `changeset version --snapshot beta`. The snapshot job has `contents: read`, and `scripts/publish-beta-snapshot.mjs` restores the checkout, so the prerelease version stays uncommitted.
- `production` opens a **Version Packages** pull request through the release GitHub App. Merging it publishes `latest` from the `release` environment with npm trusted publishing and provenance, and creates GitHub releases. The workflow then opens `sync/consumed-changesets-*` into `develop`. Squash-merge that pull request before the next promotion.
- `release/**` publishes the `previous` dist-tag.

Branch setup, the `develop` into `beta` sync, graduation, and the first `0.1.0` of a package are in [docs/repo-settings.md](./docs/repo-settings.md). Security fixes are in [SECURITY.md](./SECURITY.md). The reasoning is in [docs/adr/0001-public-toolkit-monorepo.md](./docs/adr/0001-public-toolkit-monorepo.md).

Pull requests run the `pkg-pr-new` job, which publishes preview tarballs. Those previews are separate from npm releases.

## Repository

```text
packages/config      tooling presets
packages/<name>      libraries
turbo/generators     pnpm exec turbo gen package
scripts              visibility, link, and pack checks
docs                 settings, runtimes, and decisions
```

`layout:config` covers the presets. `layout:package` covers the libraries and may depend on presets and on other libraries within the runtime table above.

## License

[MIT](./LICENSE) © 2026 Subhajit Ghosh
