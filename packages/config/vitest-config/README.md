# @sgx4u/vitest-config

Vitest preset: Node environment, tests in `src/**/*.test.ts`.

Universal, edge, and node packages use this environment. The test runner is Node. Which imports the source may use is enforced by `@sgx4u/eslint-config`.

This package's export map lists `@sgx4u/source` before `import`, pointing at `src/index.ts`. TypeScript uses that condition when `customConditions` includes `@sgx4u/source`, which `@sgx4u/tsconfig/base.json` sets. Other resolvers load `dist`. `types` stays under `import`, after `@sgx4u/source`, so the source condition stays reachable.

`vitest` is a peer dependency at `^5.0.0`. This preset is a workspace dev dependency. It is not published.

## Usage

```ts
import { definePackageVitestConfig } from "@sgx4u/vitest-config";

export default definePackageVitestConfig();
```

## API

```ts
function definePackageVitestConfig(options?: ViteUserConfig): ViteUserConfig;
```

`options` defaults to an empty object.

| Field              | Default                |
| ------------------ | ---------------------- |
| `test.environment` | `"node"`               |
| `test.include`     | `["src/**/*.test.ts"]` |

Pass a plain config object to override one field. A `test` object replaces defaults one field at a time, so `environment` stays `node` unless the caller sets it. Other top-level fields are copied onto the result. `options` is left unchanged.

A function, a promise, an array, or `null` throws `TypeError`. The message names `options` and the received value. Those values would skip the Node environment and the `src/**/*.test.ts` include.

Universal, edge, and node packages use `environment: "node"`, because the test process is Node. `@sgx4u/eslint-config` decides which imports `src` may use.
