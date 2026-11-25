# Contributing

Thanks for helping with the public `@sgx4u` toolkit. UI work belongs in [sgx4u-ui](https://github.com/sgx4u/sgx4u-ui). Private code does not belong in this repository at all.

## Setup

1. Install Node 24. `.nvmrc` pins the major version used for development and CI. Published packages still declare `node >= 22.12`.
2. Enable Corepack, or install pnpm 11.25. The `packageManager` field is the source of truth.
3. `pnpm install`
4. `pnpm test`

Lefthook installs on `pnpm install`. Commits are checked with commitlint (Conventional Commits) and lint-staged.

## Pull requests

Open a pull request from a fork into `develop`. That is the default branch. Pull requests are squash-merged. `develop` is promoted into `production` with a rebase merge when a stable release is ready. There is no `main` branch. See [docs/repo-settings.md](./docs/repo-settings.md).

Every pull request that changes a publishable package includes:

- a changeset (`pnpm changeset`)
- tests for the behavior you changed
- a README update when the public API changes
- a migration note in the changeset when the change is breaking

Breaking changes land on `develop`. They become `latest` only when `develop` is promoted into `production`. Do not commit a breaking change directly on `production`.

CI runs the affected lint, typecheck, test, and build tasks, then publint, attw, pack review, Turborepo boundaries, and sherif. It fails if a change introduces `@sgx4u-private`, `@sgx4u/ui*`, or a `link:` / `file:` dependency that points outside the repo.

## Packages

```sh
pnpm exec turbo gen package
```

Names are lowercase kebab-case. `utils`, `common`, and `shared` are rejected. The folder is `domains/<domain>/<name>` and the npm name is `@sgx4u/<name>`.

| Domain       | Tier                         | Runtime                                         |
| ------------ | ---------------------------- | ----------------------------------------------- |
| `platform`   | `platform`                   | tooling, not imported by published runtime code |
| `foundation` | `foundation` or `capability` | `universal`                                     |
| `backend`    | `adapter`                    | `edge` or `node`                                |

Runtime dependencies on other toolkit packages use `workspace:^`. Presets use `workspace:*`. Third-party versions use `catalog:`.

Libraries export named functions from `src/index.ts`, with explicit return types. Tests sit next to the source. tsdown writes `dist`. The `files` field publishes `dist` and `src` (so the `@sgx4u/source` condition resolves) and excludes tests.

## Local linking

While you are changing a package together with an app, from the app:

```sh
pnpm link --hard ../sgx4u-toolkit/domains/foundation/string
```

That writes a `link:` or `file:` entry. Remove it with `pnpm unlink` before you commit. The pre-commit hook and CI reject an entry that points outside this repo.

## First publish of a new package

npm trusted publishing can be attached only after the package exists.

1. Promote the package to `production` and let the Version Packages pull request bump it to `0.1.0`, or check out that commit. `develop` only publishes a beta snapshot and does not consume the changeset.
2. From the package directory, with npm CLI 11.5.1+ and 2FA: `npm publish --access public`.
3. On npm, add a trusted publisher: repository `sgx4u/sgx4u-toolkit`, workflow `release.yml`, environment `release`. The npm command is `npm trust github --repo sgx4u/sgx4u-toolkit --file release.yml --env release --allow-publish`.
4. Cancel the release workflow run that is waiting to publish that same `0.1.0`. Later versions are published by CI only.

Do not create an npm token for CI.

## Questions

Use [Discussions](https://github.com/sgx4u/sgx4u-toolkit/discussions) for questions. Use issues for bugs and features. Security reports go through private vulnerability reporting. See [SECURITY.md](./SECURITY.md) and [SUPPORT.md](./SUPPORT.md).
