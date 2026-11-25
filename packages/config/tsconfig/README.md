# @sgx4u/tsconfig

Shared TypeScript presets. Published so `sgx4u-ui` and project repos extend the same compiler options the toolkit uses.

## Install

```sh
pnpm add -D @sgx4u/tsconfig
```

## Presets

| Export                              | Use                                                                                              |
| ----------------------------------- | ------------------------------------------------------------------------------------------------ |
| `@sgx4u/tsconfig/base.json`         | Strict ESM baseline. No DOM, no `@types` auto-include.                                           |
| `@sgx4u/tsconfig/library.json`      | Published libraries. Declarations and `isolatedDeclarations`.                                    |
| `@sgx4u/tsconfig/node.json`         | Node 22.12+ adapters. Add `@types/node` in the package.                                          |
| `@sgx4u/tsconfig/react.json`        | React web libraries (`sgx4u-ui`).                                                                |
| `@sgx4u/tsconfig/nextjs.json`       | Next.js apps. Bundler resolution, `noEmit`, and the Next plugin. Requires `next`.                |
| `@sgx4u/tsconfig/workers.json`      | Workers and edge libraries. Loads `@cloudflare/workers-types`, which the package must depend on. |
| `@sgx4u/tsconfig/react-native.json` | React Native libraries (`sgx4u-ui`).                                                             |

This repository's pnpm catalog does not pin `react`, `react-dom`, `next`, `hono`, `react-native`, or `@cloudflare/workers-types`. Add a catalog entry only when a package in this repo needs it. `sgx4u-ui` installs its own copies of the UI presets' dependencies. `workers.json` still loads `@cloudflare/workers-types`; the first edge package in this repo adds that catalog entry and the dependency.

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
