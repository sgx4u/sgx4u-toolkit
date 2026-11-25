# Runtimes

Every library under `packages/<name>` picks one runtime: `universal`, `edge`, or `node`. Config presets under `packages/config/<name>` are tooling. They use Node, they are tagged `layout:config`, and they are not tagged with a runtime. Published libraries do not import them at runtime. They are dev dependencies.

The generator asks for the runtime and writes the tag, the ESLint runtime, the TypeScript preset, the tsdown platform, and the Vitest environment together. Change those as a set. A package whose tag says `edge` and whose ESLint config says `node` is a mistake.

## When to pick one

`universal` when the same source must run in browsers, workers, and Node, and it does not need a Node built-in. `@sgx4u/string` is universal.

`edge` when the code runs on an edge runtime (Cloudflare Workers, or another edge runtime with the same web standards) and it may use the Workers `nodejs_compat` modules that have a real implementation. Do not pick `edge` for code that spawns processes, starts a Node server, or needs a stub module.

`node` when the code needs Node itself. Config presets are Node because they run in the toolchain.

## What each runtime may depend on

`turbo boundaries` reads the tags in each package's `turbo.json`. A dependency is allowed when it has at least one tag from the allow list. These are allow lists because an empty rule allows every dependency, which is what `runtime:node` used to be.

| Source tag          | May depend on                                                        |
| ------------------- | -------------------------------------------------------------------- |
| `runtime:universal` | `runtime:universal`, `layout:config`                                 |
| `runtime:edge`      | `runtime:universal`, `runtime:edge`, `layout:config`                 |
| `runtime:node`      | `runtime:universal`, `runtime:edge`, `runtime:node`, `layout:config` |

`layout:package` may depend on other libraries and on presets. `layout:config` may not depend on `layout:package`. A universal package cannot depend on an edge or node package, because those tags are not in its allow list. An edge package cannot depend on a node package. A node package can depend on either, because Node can call code that also runs on the edge.

## TypeScript

| Runtime     | Preset                         | What the preset adds                                                                 |
| ----------- | ------------------------------ | ------------------------------------------------------------------------------------ |
| `universal` | `@sgx4u/tsconfig/library.json` | Declaration settings on top of the strict ES2022 baseline. No DOM and no Node types. |
| `edge`      | `@sgx4u/tsconfig/edge.json`    | `lib` is `ES2022` and `WebWorker`. `types` is empty.                                 |
| `node`      | `@sgx4u/tsconfig/node.json`    | `@types/node` for the package that extends it.                                       |

`edge.json` does not depend on `@cloudflare/workers-types`. That package types one vendor, and it is not in the catalog. The WebWorker library ships with TypeScript and covers `fetch`, streams, `URL`, and the other web standards edge runtimes share. It does not type `window` or `document`.

An edge package that imports an allowed Node built-in, such as `node:buffer`, adds `@types/node` in that package. The catalog already has it. A package that needs Cloudflare-only types adds `@cloudflare/workers-types` itself and a catalog entry at the same time. Do not put that dependency on the preset.

## Build and tests

tsdown `platform` is `neutral` for universal and edge, and `node` for Node. Neutral does not assume Node or the browser. Allowed `node:` imports stay external for the runtime that loads the package. Node packages pass `{ platform: "node" }` so Node built-ins stay external.

Vitest `environment` is `node` for all three. The test process is Node. ESLint, not the test environment, decides which imports `src` may use. The repository does not take a dependency on a vendor edge emulator for that check.

## Imports

`@sgx4u/eslint-config` takes `runtime`.

Universal source cannot import a Node built-in. The rule rejects the `node:` form, including subpaths such as `node:fs/promises`, and the bare names reported by the Node process that runs ESLint.

Edge source may import web standards and the Workers `nodejs_compat` modules that Workers implements, including partial implementations such as `node:fs`, `node:http`, `node:net`, `node:dns`, and `node:tls`. It rejects the modules Workers documents as non-functional stubs: `child_process`, `cluster`, `dgram`, `domain`, `http2`, `inspector`, `readline`, `repl`, `sqlite`, `trace_events`, `tty`, `v8`, `vm`, `wasi`, `worker_threads`, and `_stream_wrap`, with or without the `node:` prefix. Those stubs can be imported and then throw. A newly implemented module does not need a rule change. A newly added stub does.

Node source may import Node built-ins.

Every runtime rejects `@sgx4u-private` and deep imports into `src/` or `dist/`.
