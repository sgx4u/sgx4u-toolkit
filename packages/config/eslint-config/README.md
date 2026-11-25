# @sgx4u/eslint-config

ESLint flat config for `@sgx4u` packages. It turns on TypeScript recommended rules, Prettier compatibility, and the Turborepo undeclared-env check. Pass `runtime`. Import rules then match that runtime.

The rule covers a static `import`, `import()`, `require()`, and `import name = require(...)`. In the toolkit repository, `turbo boundaries` is the separate check for which packages may depend on each other. See [the runtime notes](https://github.com/sgx4u/sgx4u-toolkit/blob/develop/docs/runtimes.md).

## Install

```sh
pnpm add -D @sgx4u/eslint-config eslint typescript
```

## Examples

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

`runtime` is `universal`, `edge`, or `node`. Any other value throws `TypeError`. The message names `runtime` and the received value.

`rootDir` must be an absolute path to the directory of the calling `eslint.config.js`. Pass `import.meta.dirname`. It is copied to `parserOptions.tsconfigRootDir` and is not resolved against the process working directory. The value is set on a config object with no `files` filter, so every file that config lints uses that directory. typescript-eslint records the directory of each config file that loads its recommended configs. The editor loads the repository root and each package config in one process, so that record holds more than one directory and the parser requires `tsconfigRootDir`. A missing or relative `rootDir` throws `TypeError`. The message names `rootDir` and the received value. `import.meta.dirname` is available on the Node versions this package requires (`>=22.12`).

`defineRootConfig` uses the `node` runtime and ignores `packages/**`, so each package lints itself.

| Runtime     | Imports                                                                                                                                                                                                                            | Globals                                                                                                            |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `universal` | Rejects every Node built-in, both `node:` and the bare name, including subpaths such as `node:fs/promises`.                                                                                                                        | Web standards that Node and browsers share (`fetch`, `URL`, `TextEncoder`). `process` and `window` are undeclared. |
| `edge`      | Allows web standards and Workers `nodejs_compat` modules that have an implementation (`node:fs`, `node:http`, `node:net`, `node:dns`, `node:tls`, and the rest of that set). Rejects the non-functional stub modules listed below. | Worker globals, plus `process`, `Buffer`, `global`, `setImmediate`, and `clearImmediate`.                          |
| `node`      | Allows Node built-ins.                                                                                                                                                                                                             | Node globals.                                                                                                      |

Every runtime rejects an `@sgx4u-private` specifier and a deep import into `src/` or `dist/`. Import `@sgx4u` packages through their exports map.

Edge stub modules, with or without the `node:` prefix, including subpaths:

`_stream_wrap`, `child_process`, `cluster`, `dgram`, `domain`, `http2`, `inspector`, `readline`, `repl`, `sqlite`, `trace_events`, `tty`, `v8`, `vm`, `wasi`, `worker_threads`.

The list follows the Workers Node.js compatibility document. A module leaves the list when Workers stops treating it as a stub. An implemented module stays allowed without a config change.

## Owner

Subhajit Ghosh (`@sgx4u`).

## Status

Experimental (`0.x`).
