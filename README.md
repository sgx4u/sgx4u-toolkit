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
    <a href="./CHANGELOG.md">Changelog</a>
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

`pnpm exec turbo gen package` writes the TypeScript preset, the tsdown platform, and the Vitest environment for the runtime you pick. Change those as a set.

`turbo boundaries` reads the tags in each package's `turbo.json`. A library carries one layout tag and one runtime tag, and each rule has to allow the dependency. A dependency matches an allow list when it carries at least one listed tag. The lists are explicit because an empty allow list permits every dependency.

| Source tag          | May depend on                                                        |
| ------------------- | -------------------------------------------------------------------- |
| `runtime:universal` | `runtime:universal`, `layout:config`                                 |
| `runtime:edge`      | `runtime:universal`, `runtime:edge`, `layout:config`                 |
| `runtime:node`      | `runtime:universal`, `runtime:edge`, `runtime:node`, `layout:config` |
| `layout:package`    | `layout:package`, `layout:config`                                    |
| `layout:config`     | Denies `layout:package`. Tooling may not depend on a library.        |

| Runtime     | TypeScript preset              | tsdown `platform`                        | Vitest |
| ----------- | ------------------------------ | ---------------------------------------- | ------ |
| `universal` | `@sgx4u/tsconfig/library.json` | `neutral`, the preset default            | `node` |
| `edge`      | `@sgx4u/tsconfig/edge.json`    | `neutral`, the preset default            | `node` |
| `node`      | `@sgx4u/tsconfig/node.json`    | `node`, passed as `{ platform: "node" }` | `node` |

`@sgx4u/tsconfig/base.json` is the strict ESM baseline: `ES2022`, `NodeNext`, `strict`, `types` set to `[]`, and `customConditions` set to `@sgx4u/source`. `library.json` adds `declaration`, `declarationMap`, `sourceMap`, `isolatedDeclarations`, and `exactOptionalPropertyTypes`. `edge.json` sets `lib` to `ES2022` and `WebWorker`, and `types` to `[]`. `node.json` sets `types` to `["node"]` and keeps the baseline `lib`. Add `@types/node` in a Node package. An edge package that imports an allowed Node built-in, such as `node:buffer`, adds `@types/node` in that package too. A package that needs Cloudflare-only types adds `@cloudflare/workers-types` in that package and a catalog entry in the same change.

`neutral` is platform-agnostic. tsdown builds CommonJS with the `node` platform for every runtime. The test process is Node for every runtime. ESLint decides which imports `src` may use.

`@sgx4u/eslint-config` takes `runtime` (`universal`, `edge`, or `node`) and `rootDir`. `rootDir` must be an absolute path. Pass `import.meta.dirname` from the calling `eslint.config.js`. Any other `runtime` throws `TypeError`. A missing or relative `rootDir` throws `TypeError`. Universal source uses web standards and may not import Node built-ins, including `node:` subpaths and the bare names reported by the Node process that runs ESLint. Edge source may use web standards and the Workers `nodejs_compat` modules that have an implementation, including partial ones such as `node:fs`, `node:http`, `node:net`, `node:dns`, and `node:tls`. Node source may use Node built-ins. Static `import`, `import()`, `require()`, and `import name = require(...)` are all checked. Non-functional Workers stubs stay rejected. Add a name to that list when Workers documents a new stub, and leave a newly implemented module allowed.

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

- `beta` publishes with `changeset version --snapshot beta`. The version is `0.0.0-beta-<timestamp>` and stays uncommitted. The snapshot job has `contents: read`, and `scripts/publish-beta-snapshot.mjs` restores the checkout. A committed prerelease could ride a graduation onto `develop`, and the rebase into `production` would publish it as `latest`.
- `production` opens a **Version Packages** pull request through the release GitHub App. Merging it publishes `latest` from the `release` environment with npm trusted publishing and provenance, and creates GitHub releases. The workflow then opens `sync/consumed-changesets-*` into `develop`. Squash-merge that pull request before the next promotion. The branch only deletes changeset files `production` already consumed. A pull request whose head is `production` would list commits already on `develop`, because a squash merge is not an ancestor.
- `release/**` publishes the `previous` dist-tag.

The first `0.1.0` of a library is published once from a laptop, with npm CLI 11.5.1 or newer, so npm can attach a trusted publisher: `npm trust github --repo sgx4u/sgx4u-toolkit --file release.yml --env release --allow-publish`. Later versions come from `release.yml`. Leave `registry-url` unset on `actions/setup-node`, and add no `NPM_TOKEN` secret. Either one writes an empty `_authToken`, and npm then skips the trusted publisher. A release with no libraries exits without publishing.

<h3 id="keeping-beta-in-sync">Keeping beta in sync</h3>

Merge `develop` into `beta` with a merge commit after a security fix, and on a regular cadence:

```sh
git fetch origin
git checkout -b sync/develop-into-beta origin/beta
git merge origin/develop
```

Open a pull request into `beta` and merge it with a merge commit. A squash would drop `develop` from the ancestry of `beta`, and the next sync would replay the same commits. Linear history is required on `develop`, `production`, and `release/**`. It stays off `beta` so this merge commit can land. Feature pull requests are still squash-merged.

Graduate an experiment from its feature branch. `beta` also holds unfinished experiments, so the graduation pull request does not come from `beta`. After the change lands on `develop`, sync `beta` as above. When the same lines conflict, keep the `develop` side.

What shipped for people using the libraries is in [CHANGELOG.md](./CHANGELOG.md). Each published library keeps its own changelog beside that library, and the toolkit changelog links to it once the library is published.

Security fixes are in [SECURITY.md](./SECURITY.md).

Pull requests run the `pkg-pr-new` job, which publishes preview tarballs. Those previews are separate from npm releases.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="repository">📁 Repository</h2>

```text
packages/<name>      published libraries
turbo/generators     pnpm exec turbo gen package
scripts              checks and publish scripts
```

`layout:package` covers the libraries. The dependency rules are in [Runtimes](#runtimes).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="contributing">🤝 Contributing</h2>

Contribution rules, the pull request checklist, and the package generator are in [CONTRIBUTING.md](./CONTRIBUTING.md). Changeset behavior is in [.changeset/README.md](./.changeset/README.md). Where to ask is in [SUPPORT.md](./SUPPORT.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="license">📄 License</h2>

[MIT](./LICENSE) © 2026 Subhajit Ghosh

<p align="right">(<a href="#readme-top">back to top</a>)</p>
