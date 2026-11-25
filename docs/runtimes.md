# Runtimes

Every library under `packages/<name>` picks one runtime: `universal`, `edge`, or `node`. Config presets under `packages/config/<name>` are tooling. They use Node, they are tagged `layout:config`, and they are dev dependencies.

`pnpm exec turbo gen package` asks for the runtime and writes the tag, the ESLint runtime, the TypeScript preset, the tsdown config, and the Vitest config together. Change those as a set.

## When to pick one

| Runtime     | Pick it when                                                                                                                                        |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `universal` | The same source runs in browsers, workers, and Node, using web standards. `@sgx4u/string` is universal.                                             |
| `edge`      | The code runs on an edge runtime, such as Cloudflare Workers, and may use the Workers `nodejs_compat` modules that have an implementation.          |
| `node`      | The code needs Node itself: processes, a Node server, or an API outside the edge subset. Config presets are Node because they run in the toolchain. |

## Dependencies

`turbo boundaries` reads the tags in each package's `turbo.json`. A library carries a layout tag and a runtime tag, and each of those rules has to allow the dependency. A dependency matches an allow list when it carries at least one listed tag. The lists are explicit because an empty allow list permits every dependency.

| Source tag          | May depend on                                                        |
| ------------------- | -------------------------------------------------------------------- |
| `runtime:universal` | `runtime:universal`, `layout:config`                                 |
| `runtime:edge`      | `runtime:universal`, `runtime:edge`, `layout:config`                 |
| `runtime:node`      | `runtime:universal`, `runtime:edge`, `runtime:node`, `layout:config` |
| `layout:package`    | `layout:package`, `layout:config`                                    |
| `layout:config`     | Denies `layout:package`.                                             |

## TypeScript

`@sgx4u/tsconfig/base.json` is the strict ESM baseline: `ES2022`, `NodeNext`, `strict`, `types` set to `[]`, and `customConditions` set to `@sgx4u/source`.

| Runtime     | Preset                         | What the preset adds                                                                                    |
| ----------- | ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `universal` | `@sgx4u/tsconfig/library.json` | `declaration`, `declarationMap`, `sourceMap`, `isolatedDeclarations`, and `exactOptionalPropertyTypes`. |
| `edge`      | `@sgx4u/tsconfig/edge.json`    | `lib` is `ES2022` and `WebWorker`. `types` is `[]`.                                                     |
| `node`      | `@sgx4u/tsconfig/node.json`    | `types` is `["node"]`. `lib` stays the baseline `ES2022`.                                               |

`edge.json` types the worker web standards that ship with TypeScript (`fetch`, streams, `URL`). An edge package that imports an allowed Node built-in, such as `node:buffer`, adds `@types/node` in that package. The catalog already has it. A package that needs Cloudflare-only types adds `@cloudflare/workers-types` in that package and a catalog entry in the same change.

`node.json` sets `"types": ["node"]`. TypeScript resolves `@types/node` from the package being compiled. Add `@types/node` to that package.

## Build and tests

| Runtime     | tsdown `platform`                        | Vitest `environment` |
| ----------- | ---------------------------------------- | -------------------- |
| `universal` | `neutral`, the preset default            | `node`               |
| `edge`      | `neutral`, the preset default            | `node`               |
| `node`      | `node`, passed as `{ platform: "node" }` | `node`               |

`neutral` is platform-agnostic. Universal and edge packages keep that preset default. Node packages pass `{ platform: "node" }`. tsdown builds the CommonJS format with the `node` platform for every runtime. The Vitest environment is `node` for every runtime because the test process is Node. ESLint decides which imports `src` may use.

## Imports

`@sgx4u/eslint-config` takes `runtime`: `universal`, `edge`, or `node`. Any other value throws.

Universal source uses web standards. The rule rejects Node built-ins, both the `node:` form (including subpaths such as `node:fs/promises`) and the bare names reported by the Node process that runs ESLint. Edge source may use web standards and the Workers `nodejs_compat` modules that have an implementation, including partial ones such as `node:fs`, `node:http`, `node:net`, `node:dns`, and `node:tls`. Node source may use Node built-ins.

Static `import`, `import()`, `require()`, and `import name = require(...)` are all checked. The edge stub names, and the globals for each runtime, are in the [`@sgx4u/eslint-config` README](../packages/config/eslint-config/README.md). A newly implemented module stays allowed. Add a name to the stub list when Workers documents a new non-functional stub.
