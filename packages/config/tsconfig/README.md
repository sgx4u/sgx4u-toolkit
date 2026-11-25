# @sgx4u/tsconfig

Shared TypeScript presets for packages in this repository.

## Install

```sh
pnpm add -D @sgx4u/tsconfig
```

## Presets

| Export                         | Use                                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------------------ |
| `@sgx4u/tsconfig/base.json`    | Strict ESM baseline. No DOM, no `@types` auto-include.                                           |
| `@sgx4u/tsconfig/library.json` | Published libraries. Declarations and `isolatedDeclarations`.                                    |
| `@sgx4u/tsconfig/node.json`    | Node 22.12+ packages. Add `@types/node` in the package.                                          |
| `@sgx4u/tsconfig/workers.json` | Workers and edge libraries. Loads `@cloudflare/workers-types`, which the package must depend on. |

`workers.json` loads `@cloudflare/workers-types`. That package is not in the catalog. The first edge package in this repo adds the catalog entry and the dependency. Add a catalog entry only when a package in this repo needs it.

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
