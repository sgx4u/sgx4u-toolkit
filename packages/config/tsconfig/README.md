# @sgx4u/tsconfig

Shared TypeScript presets for packages in this repository.

## Install

```sh
pnpm add -D @sgx4u/tsconfig
```

## Presets

| Export                         | Use                                                                                                                                                                                          |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@sgx4u/tsconfig/base.json`    | Strict ESM baseline. No DOM, no `@types` auto-include.                                                                                                                                       |
| `@sgx4u/tsconfig/library.json` | Universal libraries. Declarations and `isolatedDeclarations`.                                                                                                                                |
| `@sgx4u/tsconfig/edge.json`    | Edge libraries. ES2022 plus the WebWorker library (`fetch`, streams, and the other web standards). `types` stays empty, so no `@cloudflare/workers-types` and no `@types/node` are required. |
| `@sgx4u/tsconfig/node.json`    | Node 22.12+ packages. `lib` stays the base `ES2022`. Add `@types/node` in the package.                                                                                                       |

`edge.json` does not load a vendor types package. TypeScript's WebWorker library is enough for the web standards edge runtimes share. A package that imports an allowed Node built-in adds `@types/node` itself. A package that needs Cloudflare-only types can add `@cloudflare/workers-types` itself. Add a catalog entry only when a package in this repo needs it.

This package does not depend on `@types/node`. `node.json` sets `"types": ["node"]`, and TypeScript looks that package up from the project being compiled, not from this preset's `node_modules`.

`customConditions` includes `@sgx4u/source`, so workspace and `pnpm link` builds can resolve TypeScript source.

## Examples

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

## Owner

Subhajit Ghosh (`@sgx4u`).

## Status

Experimental (`0.x`).
