<a id="readme-top"></a>

<div align="center">
    <a href="https://github.com/sgx4u/sgx4u-toolkit">
        <img src="https://github.com/sgx4u/sgx4u-toolkit/blob/develop/logo.svg?raw=true" width="75" alt="SGX4U" />
    </a>

<h1 align="center">🌟 @sgx4u/tsconfig 🌟</h1>

<p align="center">Shared TypeScript presets for <code>@sgx4u</code> packages.</p>

<p align="center">
    <a href="../../../.github/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/sgx4u/sgx4u-toolkit/ci.yml?branch=develop&style=for-the-badge&label=ci&labelColor=353535" alt="ci" /></a>
    <a href="../../../LICENSE"><img src="https://img.shields.io/github/license/sgx4u/sgx4u-toolkit?style=for-the-badge&labelColor=353535&color=4f46e5" alt="License: MIT" /></a>
    <a href="./package.json"><img src="https://img.shields.io/badge/node-%3E%3D22.12-339933?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=353535" alt="Node &gt;=22.12" /></a>
</p>

<p align="center">Part of <a href="../../../README.md">sgx4u-toolkit</a>.</p>
</div>

## About

Shared TypeScript presets for `@sgx4u` packages. Each preset is a JSON file on the export map.

Experimental (`0.x`).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Installation

```sh
pnpm add -D @sgx4u/tsconfig       # pnpm
npm install --save-dev @sgx4u/tsconfig    # npm
yarn add --dev @sgx4u/tsconfig    # yarn
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

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

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## API

| Export                         | Use                                                                                                                               |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `@sgx4u/tsconfig/base.json`    | Strict ESM baseline. `ES2022`, `NodeNext`, `strict`, `types` set to `[]`, and `customConditions` set to `@sgx4u/source`.          |
| `@sgx4u/tsconfig/library.json` | Universal libraries. Adds `declaration`, `declarationMap`, `sourceMap`, `isolatedDeclarations`, and `exactOptionalPropertyTypes`. |
| `@sgx4u/tsconfig/edge.json`    | Edge libraries. `lib` is `ES2022` and `WebWorker`. `types` is `[]`.                                                               |
| `@sgx4u/tsconfig/node.json`    | Node 22.12+ packages. `types` is `["node"]`. `lib` stays the baseline `ES2022`. Add `@types/node` in the package that extends it. |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Runtime support

`library.json` extends `base.json` for universal libraries. `edge.json` extends `base.json` for edge libraries. `node.json` extends `base.json` for Node packages.

`edge.json` types the worker web standards that ship with TypeScript (`fetch`, streams, `URL`). An edge package that imports an allowed Node built-in adds `@types/node` in that package. A package that needs Cloudflare-only types adds `@cloudflare/workers-types` in that package. In this repository, add the catalog entry in the same change.

`node.json` sets `"types": ["node"]`. TypeScript resolves `@types/node` from the package being compiled.

`customConditions` includes `@sgx4u/source`, so workspace and `pnpm link` builds can resolve TypeScript source.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Repository rules are in [CONTRIBUTING.md](../../../CONTRIBUTING.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

[MIT](../../../LICENSE) © 2026 Subhajit Ghosh (`@sgx4u`).

<p align="right">(<a href="#readme-top">back to top</a>)</p>
