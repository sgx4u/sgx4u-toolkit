# Contributing

## Setup

1. Install Node 24. `.nvmrc` is the version for development and CI. Published packages declare `node >= 22.12`.
2. Enable Corepack, or install pnpm 11.25.0. The `packageManager` field is the pin.
3. Run `pnpm install`.
4. Run `pnpm test`.

The root package is `@sgx4u/toolkit`.

`pnpm install` runs Lefthook through the `prepare` script. When `core.hooksPath` is already set, that hook path stays. Commits go through commitlint (Conventional Commits) and lint-staged. The development commands are in the [README](./README.md#development).

## Branches

Open a pull request from a fork.

| Target                       | When                                                     |
| ---------------------------- | -------------------------------------------------------- |
| `develop`                    | The change is ready for the stable line. Default branch. |
| `beta`                       | The change is an experiment.                             |
| `release/<package>/v<major>` | A patch or minor fix for that older major.               |

Pull requests are squash-merged. Promote `develop` into `production` with a rebase merge when a stable release is ready. Publishing runs from `beta`, `production`, and `release/**`. Merge settings are in [docs/repo-settings.md](./docs/repo-settings.md).

Graduate an experiment from its feature branch:

1. Squash-merge the feature branch into `beta` so the snapshot publish includes it.
2. Rebase that branch onto `develop` and open the pull request into `develop`, with a changeset when published behavior changed.
3. After it lands, merge `develop` into `beta` with a merge commit so the experimental line picks up the stable copy. Commands are in [Keeping beta in sync](./docs/repo-settings.md#keeping-beta-in-sync).

`beta` holds every experiment still in progress, so the graduation pull request comes from the feature branch. If that branch was deleted, recreate the change on a new branch from `develop`.

## Pull requests

Every pull request that changes published behavior includes:

- a changeset (`pnpm changeset`), or an update to the pending one before the first publish. The format is in [.changeset/README.md](./.changeset/README.md). Docs, comments, tests, refactors, CI, and `packages/config` do not need one
- tests for the behavior you changed
- a README update when the public API changes
- a `Breaking` entry and a migration snippet when the change is breaking

A security fix follows [SECURITY.md](./SECURITY.md).

## Checks

Pull requests into `develop`, `beta`, `production`, and `release/**` run [`.github/workflows/ci.yml`](./.github/workflows/ci.yml).

| Check                 | What it runs                                                                                                                                             |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ci / lint`           | Affected package lint, root ESLint, `turbo boundaries`, sherif, and `scripts/check-links.mjs`.                                                           |
| `ci / typecheck`      | Affected package typecheck, then `tsc --noEmit` for the generator.                                                                                       |
| `ci / test`           | `pnpm test`.                                                                                                                                             |
| `ci / build`          | Affected `turbo run build`.                                                                                                                              |
| `ci / package-checks` | Affected `check:package` (publint and attw; the task depends on `build`), `scripts/check-pack.mjs`, and on a pull request `scripts/check-changeset.mjs`. |

`scripts/check-links.mjs` requires every `link:` and `file:` dependency to resolve inside this repository. See [Local linking](#local-linking).

Optional checks, once the repository requires them: `ci / test-node-22`, `ci / dependency-review`, `ci / pkg-pr-new`, `security / analyze`, `security / secrets`. `test-node-22` runs affected package tests on Node 22. The `security` workflow is CodeQL and gitleaks, including a weekly run.

## Packages

```sh
pnpm exec turbo gen package
```

The generator asks for the name and the kind. Use lowercase kebab-case starting with a letter, and name the one job the package does. The generator reserves `config`, `toolkit`, `utils`, `common`, and `shared`. The npm name is `@sgx4u/<name>`.

| Kind      | Folder                   | Runtime                                                                      |
| --------- | ------------------------ | ---------------------------------------------------------------------------- |
| `config`  | `packages/config/<name>` | `node`. Private workspace tooling. Not published, and no changeset.          |
| `regular` | `packages/<name>`        | `universal`, `edge`, or `node`. Published. The generator writes a changeset. |

The generator writes the package and a CODEOWNERS line. A regular package also gets one initial changeset. A config package is `"private": true` and does not.

A runtime dependency on another toolkit package uses `workspace:^`. Presets and other dev tooling use `workspace:*`. Third-party versions use `catalog:`. Add a catalog entry when a package in this repository needs that dependency.

Pick the runtime from [docs/runtimes.md](./docs/runtimes.md).

Libraries keep `src/index.ts` as a re-export list. Each feature is a folder under `src` with the implementation, a folder `index.ts`, and the test. Functions have explicit return types. tsdown writes ESM and CommonJS into `dist` (`index.js` with `index.d.ts`, and `index.cjs` with `index.d.cts`). The `files` field publishes `dist`, `src`, and `README.md`, and excludes tests. The export map lists `@sgx4u/source`, then `import` and `require` with `types` before the runtime file, and sets `main`, `module`, and `types`.

## Local linking

From the app you are changing alongside a package:

```sh
pnpm link --hard ../sgx4u-toolkit/packages/string
```

That writes a `link:` or `file:` entry. `pnpm unlink` removes it. Commit `workspace:` ranges.

## Questions

Where to ask is in [SUPPORT.md](./SUPPORT.md).
