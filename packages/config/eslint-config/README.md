# @sgx4u/eslint-config

ESLint flat config for `@sgx4u` packages. It turns on TypeScript recommended rules, Prettier compatibility, and the Turborepo undeclared-env check. Unused variables and arguments that start with `_` are allowed. Pass `runtime`. Import rules then match that runtime.

The rule covers a static `import`, `import()`, `require()`, and `import name = require(...)`. In the toolkit repository, `turbo boundaries` is the separate check for which packages may depend on each other. See [the runtime notes](../../../README.md#runtimes).

`import` loads `index.js` with `index.d.ts`.

Peers are `eslint` at `^10.0.0` and `typescript` at `>=6`. This preset is a workspace dev dependency. It is not published.

## Usage

A package `eslint.config.js`:

```js
import { definePackageConfig } from "@sgx4u/eslint-config";

export default definePackageConfig({
    runtime: "universal",
    rootDir: import.meta.dirname,
});
```

The repository root `eslint.config.js`:

```js
import { defineRootConfig } from "@sgx4u/eslint-config";

export default defineRootConfig({
    rootDir: import.meta.dirname,
});
```

## API

| Export                | Kind                                               |
| --------------------- | -------------------------------------------------- |
| `definePackageConfig` | `(options: PackageLintOptions) => Linter.Config[]` |
| `defineRootConfig`    | `(options: RootLintOptions) => Linter.Config[]`    |
| `PackageRuntime`      | `"universal" \| "edge" \| "node"`                  |
| `PackageLintOptions`  | `{ runtime: PackageRuntime, rootDir: string }`     |
| `RootLintOptions`     | `{ rootDir: string }`                              |

### `definePackageConfig`

| Option    | Required | Contract                                                                                                                                                                                          |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `runtime` | yes      | `universal`, `edge`, or `node`. Any other value throws `TypeError`. The message names `runtime` and the received value.                                                                           |
| `rootDir` | yes      | Absolute path to the directory of the calling `eslint.config.js`. Pass `import.meta.dirname`. A missing or relative value throws `TypeError`. The message names `rootDir` and the received value. |

`rootDir` is then normalized with `path.resolve`, so a Windows path that uses `/` is still a resolved absolute path, and it is not resolved against the process working directory before that.

typescript-eslint enables its parser on one config object and records the directory of each `eslint.config.js` that reads its configs. The editor loads the repository root and each package config in one process, so that record holds more than one directory. Parsing then requires `parserOptions.tsconfigRootDir`. The normalized directory is written onto every returned config object that has `languageOptions` — including the object that sets the parser, and any object that sets `parserOptions.project` or `parserOptions.projectService` — and onto a final object with no `files` filter. Config files outside `src`, such as `tsdown.config.ts`, use that directory.

The ignore list is `dist`, `coverage`, and `node_modules`. Files under `src` use the import bans for `runtime`. Other `js`, `mjs`, `cjs`, and `ts` files, plus `scripts` and `turbo`, use the Node bans. `options` is left unchanged.

### `defineRootConfig`

| Option    | Required | Contract                                                                                                                                          |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rootDir` | yes      | Absolute path of the root `eslint.config.js`. Pass `import.meta.dirname`. The same `TypeError` and `path.resolve` rules as `definePackageConfig`. |

`defineRootConfig` uses the `node` runtime and ignores `packages/**`, so each package lints itself. `rootDir` is copied to `parserOptions.tsconfigRootDir` the same way as `definePackageConfig`.

## Runtime support

| Runtime     | Imports                                                                                                                                                                                                                            | Globals                                                                                                            |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `universal` | Rejects every Node built-in, both `node:` and the bare name, including subpaths such as `node:fs/promises`.                                                                                                                        | Web standards that Node and browsers share (`fetch`, `URL`, `TextEncoder`). `process` and `window` are undeclared. |
| `edge`      | Allows web standards and Workers `nodejs_compat` modules that have an implementation (`node:fs`, `node:http`, `node:net`, `node:dns`, `node:tls`, and the rest of that set). Rejects the non-functional stub modules listed below. | Worker globals, plus `process`, `Buffer`, `global`, `setImmediate`, and `clearImmediate`.                          |
| `node`      | Allows Node built-ins.                                                                                                                                                                                                             | Node globals.                                                                                                      |

Every runtime rejects a deep import into `src/` or `dist/`. Import `@sgx4u` packages through their exports map.

Edge stub modules, with or without the `node:` prefix, including subpaths:

`_stream_wrap`, `child_process`, `cluster`, `dgram`, `domain`, `http2`, `inspector`, `readline`, `repl`, `sqlite`, `trace_events`, `tty`, `v8`, `vm`, `wasi`, `worker_threads`.

The list follows the Workers Node.js compatibility document. A module leaves the list when Workers stops treating it as a stub. An implemented module stays allowed without a config change.
