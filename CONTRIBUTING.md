# Contributing

Thanks for helping with the public `@sgx4u` toolkit.

## Setup

1. Install Node 24. `.nvmrc` pins the major version used for development and CI. Published packages still declare `node >= 22.12`.
2. Enable Corepack, or install pnpm 11.25. The `packageManager` field is the source of truth.
3. `pnpm install`
4. `pnpm test`

The root `package.json` name is `@sgx4u/toolkit`.

Lefthook installs on `pnpm install`. Commits are checked with commitlint (Conventional Commits) and lint-staged.

## Pull requests

Open a pull request from a fork into `develop` for work that is ready for production. That is the default branch, and it is the stable integration branch. Pushes to `develop` do not publish. Pull requests are squash-merged. `develop` is promoted into `production` with a rebase merge when a stable release is ready. See [docs/repo-settings.md](./docs/repo-settings.md).

Experimental work opens a pull request into `beta`. `beta` may run ahead of `develop`. Squash-merge there too. Pushes to `beta` publish an uncommitted snapshot on the npm `beta` dist-tag (`0.0.0-beta-<timestamp>`). Those versions are not committed, so they cannot leak into `develop` or `production`.

Keep `beta` in sync by merging `develop` into `beta` with a merge commit. Do this regularly, and whenever a security fix lands on `develop`. Squash and rebase do not record `develop` as an ancestor, so the next sync would replay the same commits.

A beta feature graduates through its feature branch. Rebase that branch onto `develop` and open a pull request into `develop`. Do not merge `beta` into `develop`. `beta` contains every experiment still in progress.

Every pull request that changes a publishable package includes:

- a changeset (`pnpm changeset`)
- tests for the behavior you changed
- a README update when the public API changes
- a migration note in the changeset when the change is breaking

Every change, whether patch, minor, or major, lands on `develop` through a pull request. It becomes `latest` only when `develop` is promoted into `production`. Do not commit directly on `production`. Experimental work may go to `beta` first, then graduate through a pull request into `develop`.

Major (breaking) changes are never backported to `release/**`. Those branches receive only patch and minor fixes for the previous major.

A security fix lands on `develop` first, is promoted to `production` for `latest`, is cherry-picked onto each supported `release/**` branch when it is a patch or minor fix, and is merged into `beta` so experimental builds pick it up. A major security fix is not backported. See [SECURITY.md](./SECURITY.md).

CI runs the affected lint, typecheck, test, and build tasks, then publint, attw, pack review, Turborepo boundaries, and sherif. It fails if a change introduces `@sgx4u-private` or a `link:` / `file:` dependency that points outside the repo.

## Packages

```sh
pnpm exec turbo gen package
```

Names are lowercase kebab-case. `utils`, `common`, and `shared` are rejected. Config presets live in `packages/config/<name>`. Every other package lives in `packages/<name>`. The npm name is `@sgx4u/<name>`.

| Kind      | Folder                   | Runtime                                                     |
| --------- | ------------------------ | ----------------------------------------------------------- |
| `config`  | `packages/config/<name>` | `node`. Tooling. Published runtime code does not import it. |
| `package` | `packages/<name>`        | `universal`, `edge`, or `node`                              |

Runtime dependencies on other toolkit packages use `workspace:^`. Presets use `workspace:*`. Third-party versions use `catalog:`. Add a catalog entry only when a package needs it. Do not add a version for a dependency no package in this repository installs.

Pick the runtime from [docs/runtimes.md](./docs/runtimes.md). Universal packages extend `@sgx4u/tsconfig/library.json`. Edge packages extend `@sgx4u/tsconfig/edge.json` (ES2022 plus the WebWorker library, no extra types package). Node packages extend `@sgx4u/tsconfig/node.json` and depend on `@types/node`. An edge package that imports an allowed Node built-in adds `@types/node` itself. Do not add `@cloudflare/workers-types` unless that package needs Cloudflare-only types.

`pnpm lint`, `pnpm typecheck`, and `pnpm check` are the local equivalents of the CI steps. `pnpm changeset` runs the Changesets binary directly.

Libraries export named functions from `src/index.ts`, with explicit return types. Tests sit next to the source. tsdown writes ESM and CommonJS into `dist` (`index.js` / `index.d.ts` and `index.cjs` / `index.d.cts`). The `files` field publishes `dist` and `src` (so the `@sgx4u/source` condition resolves) and excludes tests. Export maps list `types` before the runtime file for both `import` and `require`, and set `main`, `module`, and `types` as fallbacks.

## Local linking

While you are changing a package together with an app, from the app:

```sh
pnpm link --hard ../sgx4u-toolkit/packages/string
```

That writes a `link:` or `file:` entry. Remove it with `pnpm unlink` before you commit. The pre-commit hook and CI reject an entry that points outside this repo.

## First publish of a new package

npm trusted publishing can be attached only after the package exists.

1. Promote the package to `production` and let the Version Packages pull request bump it to `0.1.0`, or check out that commit. `develop` does not publish and does not consume the changeset. `beta` publishes an uncommitted snapshot and also leaves the changeset in git.
2. From the package directory, with npm CLI 11.5.1+ and 2FA: `npm publish --access public`.
3. On npm, add a trusted publisher: repository `sgx4u/sgx4u-toolkit`, workflow `release.yml`, environment `release`. The npm command is `npm trust github --repo sgx4u/sgx4u-toolkit --file release.yml --env release --allow-publish`.
4. Cancel the release workflow run that is waiting to publish that same `0.1.0`. Later versions are published by CI only.

Do not create an npm token for CI.

## Questions

Use [Discussions](https://github.com/sgx4u/sgx4u-toolkit/discussions) for questions. Use issues for bugs and features. Security reports go through private vulnerability reporting. See [SECURITY.md](./SECURITY.md) and [SUPPORT.md](./SUPPORT.md).
