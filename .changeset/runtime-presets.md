---
"@sgx4u/eslint-config": patch
"@sgx4u/tsconfig": minor
"@sgx4u/tsdown-config": patch
"@sgx4u/vitest-config": patch
---

Make universal, edge, and node the same kind of choice.

`@sgx4u/tsconfig` publishes `edge.json` for edge libraries. It adds the WebWorker library to the strict baseline, so `fetch` and streams typecheck without a Cloudflare types package. `workers.json` is removed. It only loaded `@cloudflare/workers-types`, which this repository does not install. Extend `edge.json` instead.

`@sgx4u/eslint-config` still accepts `universal`, `edge`, or `node`. Universal rules reject every Node built-in, including subpaths. Edge rules allow the Workers `nodejs_compat` modules that have an implementation, and reject the non-functional stub modules.

`@sgx4u/tsdown-config` still defaults to `platform: "neutral"`. Node packages pass `{ platform: "node" }`. `@sgx4u/vitest-config` still runs tests on Node for every runtime. ESLint enforces the import rules.
