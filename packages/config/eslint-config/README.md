# @sgx4u/eslint-config

ESLint flat config for the toolkit. It turns on TypeScript recommended rules, Prettier compatibility, and Turborepo environment checks. Import rules reject `@sgx4u-private`, deep imports into `src/` or `dist/`, and the Node built-ins the runtime does not allow. That covers a static `import`, `import()`, `require()`, and `import name = require(...)`.

`turbo boundaries` keeps `packages/config` from depending on `packages/<name>`. That check is separate from this package. This package enforces the runtime import rules for the `runtime` you pass.

## Install

```sh
pnpm add -D @sgx4u/eslint-config eslint typescript
```

## Examples

```js
import { definePackageConfig } from "@sgx4u/eslint-config";

export default definePackageConfig({
    runtime: "universal",
    rootDir: import.meta.dirname,
});
```

`rootDir` is required. Pass `import.meta.dirname` from the `eslint.config.js` that calls this. It is set as `parserOptions.tsconfigRootDir` for every file that config lints. typescript-eslint otherwise records the directory of each config file that loads it. The editor loads several of those files in one process, sees more than one directory, and reports a parsing error on every file. `import.meta.dirname` has been part of Node.js since 20.11, and this package requires `>=22.12`. The repository root calls `defineRootConfig({ rootDir: import.meta.dirname })`.

`runtime` is `universal`, `edge`, or `node`. Any other value throws. A typo used to fall through to the Node rules.

| Runtime     | Imports                                                                                                                                                                                                                                                                          | Globals                                                                                                |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `universal` | Rejects every Node built-in, both `node:` and the bare name, including subpaths such as `node:fs/promises`.                                                                                                                                                                      | Web standards that Node and browsers share (`fetch`, `URL`, `TextEncoder`). No `window`, no `process`. |
| `edge`      | Allows web standards and Workers `nodejs_compat` modules that have an implementation (`node:fs`, `node:http`, `node:net`, and the rest of that set). Rejects the non-functional stub modules (`node:child_process`, `node:vm`, `node:worker_threads`, and the rest of that set). | Worker globals, plus `process`, `Buffer`, `global`, `setImmediate`, and `clearImmediate`.              |
| `node`      | Allows Node built-ins.                                                                                                                                                                                                                                                           | Node globals.                                                                                          |

The edge stub list follows the Workers Node.js compatibility document. A module moves off that list only when Workers stops treating it as a stub. Implemented modules stay allowed without a config change. See [the runtime notes](https://github.com/sgx4u/sgx4u-toolkit/blob/develop/docs/runtimes.md) for how this lines up with package tags and TypeScript presets.

## Owner

Subhajit Ghosh (`@sgx4u`).

## Status

Experimental (`0.x`).
