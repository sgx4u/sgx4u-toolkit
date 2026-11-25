<a id="readme-top"></a>

<div align="center">
    <a href="https://github.com/sgx4u/sgx4u-toolkit">
        <img src="https://github.com/sgx4u/sgx4u-toolkit/blob/develop/logo.svg?raw=true" width="75" alt="SGX4U" />
    </a>

<h1 align="center">🌟 @sgx4u/vitest-config 🌟</h1>

<p align="center">Vitest preset: Node environment, tests in <code>src/**/*.test.ts</code>.</p>

<p align="center">
    <a href="../../../.github/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/sgx4u/sgx4u-toolkit/ci.yml?branch=develop&style=for-the-badge&label=ci&labelColor=353535" alt="ci" /></a>
    <a href="../../../LICENSE"><img src="https://img.shields.io/github/license/sgx4u/sgx4u-toolkit?style=for-the-badge&labelColor=353535&color=4f46e5" alt="License: MIT" /></a>
    <a href="./package.json"><img src="https://img.shields.io/badge/node-%3E%3D22.12-339933?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=353535" alt="Node &gt;=22.12" /></a>
</p>

<p align="center">Part of <a href="../../../README.md">sgx4u-toolkit</a>.</p>
</div>

## About

Universal, edge, and node packages use this environment. The test runner is Node. Which imports the source may use is enforced by `@sgx4u/eslint-config`.

This package's export map lists `@sgx4u/source` before `import`, pointing at `src/index.ts`. TypeScript uses that condition when `customConditions` includes `@sgx4u/source`, which `@sgx4u/tsconfig/base.json` sets. Other resolvers load `dist`. `types` stays under `import`, after `@sgx4u/source`, so the source condition stays reachable.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Installation

`vitest` is a peer dependency at `^5.0.0`.

This preset lives in this repository and is a workspace dev dependency of the packages here. It is not published.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

```ts
import { definePackageVitestConfig } from "@sgx4u/vitest-config";

export default definePackageVitestConfig();
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

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

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Runtime support

Universal, edge, and node packages use `environment: "node"`, because the test process is Node. `@sgx4u/eslint-config` decides which imports `src` may use. This package is Node tooling. `engines.node` is `>=22.12`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Repository rules are in [CONTRIBUTING.md](../../../CONTRIBUTING.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

[MIT](../../../LICENSE) © 2026 Subhajit Ghosh (`@sgx4u`).

<p align="right">(<a href="#readme-top">back to top</a>)</p>
