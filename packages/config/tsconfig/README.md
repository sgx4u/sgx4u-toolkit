# @sgx4u/tsconfig

Shared TypeScript presets for `@sgx4u` packages. Each preset is a JSON file on the export map.

This preset is a workspace dev dependency. It is not published.

## Usage

```json
{
    "extends": "@sgx4u/tsconfig/library.json",
    "compilerOptions": {
        "rootDir": "src",
        "outDir": "dist"
    },
    "include": ["src/**/*.ts"]
}
```

## API

| Export                         | Use                                                                                                                               |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `@sgx4u/tsconfig/base.json`    | Strict ESM baseline. `ES2022`, `NodeNext`, `strict`, `types` set to `[]`, and `customConditions` set to `@sgx4u/source`.          |
| `@sgx4u/tsconfig/library.json` | Universal libraries. Adds `declaration`, `declarationMap`, `sourceMap`, `isolatedDeclarations`, and `exactOptionalPropertyTypes`. |
| `@sgx4u/tsconfig/edge.json`    | Edge libraries. `lib` is `ES2022` and `WebWorker`. `types` is `[]`.                                                               |
| `@sgx4u/tsconfig/node.json`    | Node packages. `types` is `["node"]`. `lib` stays the baseline `ES2022`. Add `@types/node` in the package that extends it.        |

`library.json`, `edge.json`, and `node.json` each extend `base.json`.

`edge.json` types the worker web standards that ship with TypeScript (`fetch`, streams, `URL`). An edge package that imports an allowed Node built-in adds `@types/node` in that package. A package that needs Cloudflare-only types adds `@cloudflare/workers-types` in that package. In this repository, add the catalog entry in the same change.

`node.json` sets `"types": ["node"]`. TypeScript resolves `@types/node` from the package being compiled.

`customConditions` includes `@sgx4u/source`, so workspace and `pnpm link` builds can resolve TypeScript source.
