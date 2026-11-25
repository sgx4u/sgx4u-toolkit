<a id="readme-top"></a>

<div align="center">
    <a href="https://github.com/sgx4u/sgx4u-toolkit">
        <img src="https://github.com/sgx4u/sgx4u-toolkit/blob/develop/logo.svg?raw=true" width="75" alt="SGX4U" />
    </a>

<h1 align="center">🌟 sgx4u-toolkit 🌟</h1>

<p align="center">
    Public Turborepo of shared <a href="https://www.npmjs.com/search?q=%40sgx4u"><code>@sgx4u</code></a> packages.
</p>

<p align="center">
    <a href="./.github/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/sgx4u/sgx4u-toolkit/ci.yml?branch=develop&style=for-the-badge&label=ci&labelColor=353535" alt="ci" /></a>
    <a href="./LICENSE"><img src="https://img.shields.io/github/license/sgx4u/sgx4u-toolkit?style=for-the-badge&labelColor=353535&color=4f46e5" alt="License: MIT" /></a>
    <a href="./package.json"><img src="https://img.shields.io/badge/node-%3E%3D24-339933?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=353535" alt="Node &gt;=24" /></a>
</p>

<p align="center">
    <a href="./CONTRIBUTING.md">Contributing</a>
    &middot;
    <a href="./.github/ISSUE_TEMPLATE/bug_report.yml">Report a bug</a>
    &middot;
    <a href="./.github/ISSUE_TEMPLATE/feature_request.yml">Request a feature</a>
</p>
</div>

## Table of contents

- [About](#about)
- [Packages](#packages)
- [Runtimes](#runtimes)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Releases](#releases)
- [Repository](#repository)
- [Contributing](#contributing)
- [License](#license)

## About

A library lives in `packages/<name>`. The first library will be `date-time`.

A published library declares `"node": ">=22.12"`. It builds with tsdown and ships ESM and CommonJS. `import` resolves `dist/*.js` with `dist/*.d.ts`. `require` resolves `dist/*.cjs` with `dist/*.d.cts`. The `@sgx4u/source` export condition points at TypeScript source (`src/index.ts`). This workspace resolves it through `customConditions`. A published install uses `dist`.

Inside this repo, a runtime dependency on another toolkit package uses `workspace:^`. Dev dependencies use `workspace:*`. Third-party versions live in the pnpm catalog in `pnpm-workspace.yaml`. Add a catalog entry when a package needs that dependency.

The root workspace package is `@sgx4u/toolkit`. Its manifest is `"private": false` and it has no `version`. `scripts/check-pack.mjs` skips that name, so the workspace package stays out of the npm publish.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Packages

A library lives in `packages/<name>`. `pnpm exec turbo gen package` writes the package, including its TypeScript, build, and test config.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Runtimes

Each library picks one runtime.

| Runtime     | Choose it when                                                                                                     | It may depend on                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| `universal` | The same source runs in browsers, workers, and Node, using web standards.                                          | Universal packages.                         |
| `edge`      | The code targets an edge runtime and may use web standards plus the Workers `nodejs_compat` modules that are real. | Universal packages and other edge packages. |
| `node`      | The code needs Node itself: processes, the full filesystem, or another API outside the edge subset.                | Universal, edge, and node packages.         |

`turbo boundaries` enforces that table. `pnpm exec turbo gen package` writes the matching TypeScript, build, and test config. The rules are in [docs/runtimes.md](./docs/runtimes.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Installation

Install a published library from the `@sgx4u` scope. `<name>` is that library's kebab-case name.

```sh
pnpm add @sgx4u/<name>       # pnpm
npm install @sgx4u/<name>    # npm
yarn add @sgx4u/<name>       # yarn
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Each library README shows how to import that package. A library is imported from `@sgx4u/<name>`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Development

Install Node 24 (`.nvmrc`) and pnpm 11.25.0 (the `packageManager` field in `package.json`). The workspace `engines.node` range is `>=24`.

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
| `pnpm dev`          | `turbo run dev`. The task stays running. A library that builds with tsdown runs `tsdown --watch`.                                                                  |
| `pnpm lint`         | Package lint tasks, then root ESLint. The root config ignores `packages/**`, so package sources are linted once.                                                   |
| `pnpm typecheck`    | Package typecheck tasks, then `tsc --noEmit` for the generator.                                                                                                    |
| `pnpm test`         | Package tests, then `node --test` on `scripts/*.test.mjs`.                                                                                                         |
| `pnpm build`        | `turbo run build`.                                                                                                                                                 |
| `pnpm check`        | `turbo boundaries`, sherif, `scripts/check-visibility.mjs`, `scripts/check-links.mjs`, `turbo run check:package` (publint and attw), and `scripts/check-pack.mjs`. |
| `pnpm format:check` | Prettier. `pnpm format` writes the same format.                                                                                                                    |

`pnpm changeset` runs the Changesets CLI.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

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

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Repository

```text
packages/<name>      libraries
turbo/generators     pnpm exec turbo gen package
scripts              visibility, link, and pack checks
docs                 settings, runtimes, and decisions
```

`layout:package` covers the libraries. A library may depend on other libraries within the runtime table above.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contribution rules, the pull request checklist, and the package generator are in [CONTRIBUTING.md](./CONTRIBUTING.md). Changeset behavior is in [.changeset/README.md](./.changeset/README.md). Where to ask is in [SUPPORT.md](./SUPPORT.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

[MIT](./LICENSE) © 2026 Subhajit Ghosh

<p align="right">(<a href="#readme-top">back to top</a>)</p>
