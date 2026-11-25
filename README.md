<a id="readme-top"></a>

<div align="center">
    <a href="https://github.com/sgx4u/sgx4u-toolkit">
        <img src="https://github.com/sgx4u/sgx4u-toolkit/blob/develop/logo.svg?raw=true" width="75" alt="SGX4U" />
    </a>

<h1 align="center">🌟 sgx4u-toolkit 🌟</h1>

<h3 align="center">Public Turborepo of shared <a href="https://www.npmjs.com/search?q=%40sgx4u"><code>@sgx4u</code></a> packages.</h3>

<p align="center">
    <a href="./.github/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/sgx4u/sgx4u-toolkit/ci.yml?branch=develop&style=for-the-badge&label=ci&labelColor=353535" alt="ci" /></a>
    <a href="./LICENSE"><img src="https://img.shields.io/github/license/sgx4u/sgx4u-toolkit?style=for-the-badge&labelColor=353535&color=4f46e5" alt="License: MIT" /></a>
    <a href="./package.json"><img src="https://img.shields.io/badge/node-%3E%3D24-339933?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=353535" alt="Node &gt;=24" /></a>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm" />
    <img src="https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white" alt="Turborepo" />
    <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" />
    <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white" alt="Prettier" />
    <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
</p>

<p align="center">
    <a href="./CONTRIBUTING.md">Contributing</a>
    &middot;
    <a href="./.github/ISSUE_TEMPLATE/bug-report.yml">Report a bug</a>
    &middot;
    <a href="./.github/ISSUE_TEMPLATE/feature.yml">Request a feature</a>
</p>
</div>

<br />

<h2 id="table-of-contents">📑 Table of contents</h2>

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

<br />

<h2 id="about">💫 About</h2>

Libraries live in `packages/<name>`. A published library declares `"node": ">=22.12"`. It builds with tsdown and ships ESM and CommonJS. `import` resolves `dist/*.js` with `dist/*.d.ts`. `require` resolves `dist/*.cjs` with `dist/*.d.cts`. The `@sgx4u/source` export condition points at TypeScript source (`src/index.ts`). This workspace resolves it through `customConditions`. A published install uses `dist`.

Inside this repo, a runtime dependency on another toolkit package uses `workspace:^`. Dev dependencies use `workspace:*`. Third-party versions live in the pnpm catalog in `pnpm-workspace.yaml`. Add a catalog entry when a package needs that dependency.

The root workspace package is `@sgx4u/toolkit`. Its manifest is `"private": false` and it has no `version`. `scripts/check-pack.mjs` skips that name, so the workspace package stays out of the npm publish.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="packages">📦 Packages</h2>

Libraries live in `packages/<name>`.

- 💠 Run `pnpm exec turbo gen package`. The generator asks for the package name, the runtime, and the owner. It writes the package files for that runtime, including the TypeScript, build, and test config. Replace the scaffold export, and describe the library in its README, before the first release.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="runtimes">🌐 Runtimes</h2>

Each library picks one runtime.

| Runtime     | Choose it when                                                                                                                   |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `universal` | The same source runs in browsers, workers, and Node, using web standards.                                                        |
| `edge`      | The code targets an edge runtime and may use web standards plus the Workers `nodejs_compat` modules that have an implementation. |
| `node`      | The code needs Node itself: processes, the full filesystem, or another API outside the edge subset.                              |

`turbo boundaries` enforces the dependency rules. `pnpm exec turbo gen package` writes a package for the runtime you pick, including the TypeScript, build, and test config for that runtime. The rules are in [docs/runtimes.md](./docs/runtimes.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="installation">📥 Installation</h2>

Install a published library from the `@sgx4u` scope. `<name>` is that library's kebab-case name.

```sh
pnpm add @sgx4u/<name>       # pnpm
npm install @sgx4u/<name>    # npm
yarn add @sgx4u/<name>       # yarn
```

Node 22.12 or newer. `import` loads the ESM build. `require()` loads the CommonJS build.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="usage">💡 Usage</h2>

Import the export you need from the package. The package README lists the exports and what each one does for a caller.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="development">🛠️ Development</h2>

Install Node 24 (`.nvmrc`) and pnpm 11.25.0 (the `packageManager` field in `package.json`). The workspace `engines.node` range is `>=24`.

```sh
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm check
```

| Command             | What it runs                                                                                                                       |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`          | `turbo run dev`. The task stays running. A library that builds with tsdown runs `tsdown --watch`.                                  |
| `pnpm lint`         | Package lint tasks, then root ESLint. The root config ignores `packages/**`, so package sources are linted once.                   |
| `pnpm typecheck`    | Package typecheck tasks, then `tsc --noEmit` for the generator.                                                                    |
| `pnpm test`         | Package tests, then `node --test` on `scripts/*.test.mjs`.                                                                         |
| `pnpm build`        | `turbo run build`.                                                                                                                 |
| `pnpm check`        | `turbo boundaries`, sherif, `scripts/check-links.mjs`, `turbo run check:package` (publint and attw), and `scripts/check-pack.mjs`. |
| `pnpm format:check` | Prettier. `pnpm format` writes the same format.                                                                                    |

`pnpm changeset` adds a release note for a published package. The format is in [.changeset/README.md](./.changeset/README.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="releases">🚀 Releases</h2>

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

<br />

<h2 id="repository">📁 Repository</h2>

```text
packages/<name>      published libraries
turbo/generators     pnpm exec turbo gen package
scripts              checks and publish scripts
docs                 settings, runtimes, and decisions
```

`layout:package` covers the libraries. The dependency rules are in [docs/runtimes.md](./docs/runtimes.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="contributing">🤝 Contributing</h2>

Contribution rules, the pull request checklist, and the package generator are in [CONTRIBUTING.md](./CONTRIBUTING.md). Changeset behavior is in [.changeset/README.md](./.changeset/README.md). Where to ask is in [SUPPORT.md](./SUPPORT.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="license">📄 License</h2>

[MIT](./LICENSE) © 2026 Subhajit Ghosh

<p align="right">(<a href="#readme-top">back to top</a>)</p>
