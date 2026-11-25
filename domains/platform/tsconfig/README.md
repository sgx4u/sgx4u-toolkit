# @sgx4u/tsconfig

Shared TypeScript presets. Published so `sgx4u-ui` and project repos extend the same compiler options the toolkit uses.

## Install

```sh
pnpm add -D @sgx4u/tsconfig
```

## Presets

| Export                              | Use                                                                         |
| ----------------------------------- | --------------------------------------------------------------------------- |
| `@sgx4u/tsconfig/base.json`         | Strict ESM baseline. No DOM, no `@types` auto-include.                      |
| `@sgx4u/tsconfig/library.json`      | Published libraries. Declarations and `isolatedDeclarations`.               |
| `@sgx4u/tsconfig/node.json`         | Node 22.12+ adapters. Add `@types/node` in the package.                     |
| `@sgx4u/tsconfig/react.json`        | React web libraries (`sgx4u-ui`).                                           |
| `@sgx4u/tsconfig/nextjs.json`       | Next.js apps. Requires `next` to be installed.                              |
| `@sgx4u/tsconfig/workers.json`      | Workers and edge libraries. Add `@cloudflare/workers-types` in the package. |
| `@sgx4u/tsconfig/react-native.json` | React Native libraries (`sgx4u-ui`).                                        |

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
