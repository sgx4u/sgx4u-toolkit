<a id="readme-top"></a>

<div align="center">
    <a href="https://github.com/sgx4u/sgx4u-toolkit">
        <img src="https://github.com/sgx4u/sgx4u-toolkit/blob/develop/logo.svg?raw=true" width="75" alt="SGX4U" />
    </a>

<h1 align="center">🌟 @sgx4u/tsdown-config 🌟</h1>

<p align="center">tsdown preset for published <code>@sgx4u</code> libraries: ESM and CommonJS, declarations, source maps, and dependencies left external.</p>

<p align="center">
    <a href="../../../.github/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/sgx4u/sgx4u-toolkit/ci.yml?branch=develop&style=for-the-badge&label=ci&labelColor=353535" alt="ci" /></a>
    <a href="../../../LICENSE"><img src="https://img.shields.io/github/license/sgx4u/sgx4u-toolkit?style=for-the-badge&labelColor=353535&color=4f46e5" alt="License: MIT" /></a>
    <a href="./package.json"><img src="https://img.shields.io/badge/node-%3E%3D22.12-339933?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=353535" alt="Node &gt;=22.12" /></a>
</p>

<p align="center">Part of <a href="../../../README.md">sgx4u-toolkit</a>.</p>
</div>

## About

With `"type": "module"`, the build writes `dist/index.js` and `dist/index.d.ts` for `import`, and `dist/index.cjs` and `dist/index.d.cts` for `require`. Callers declare their own export map, including the `@sgx4u/source` condition.

This package's export map lists `@sgx4u/source` before `import` and `require`, pointing at `src/index.ts`. TypeScript uses that condition when `customConditions` includes `@sgx4u/source`, which `@sgx4u/tsconfig/base.json` sets. Other resolvers load `dist`. `types` stays under `import` and `require`, after `@sgx4u/source`, so the source condition stays reachable.

Experimental (`0.x`).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Installation

`tsdown` is a peer dependency at `^0.23.0`.

```sh
pnpm add -D @sgx4u/tsdown-config tsdown       # pnpm
npm install --save-dev @sgx4u/tsdown-config tsdown    # npm
yarn add --dev @sgx4u/tsdown-config tsdown    # yarn
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

```ts
import { defineLibraryConfig } from "@sgx4u/tsdown-config";

export default defineLibraryConfig();
```

Universal and edge packages use that call. The preset sets `platform` to `"neutral"`, a platform-agnostic target. Node packages pass `{ platform: "node" }`.

```ts
import { defineLibraryConfig } from "@sgx4u/tsdown-config";

export default defineLibraryConfig({
    platform: "node",
});
```

tsdown builds the CommonJS format with the `node` platform either way.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## API

```ts
function defineLibraryConfig(options?: UserConfig): UserConfig;
```

`options` defaults to an empty object, which keeps every preset field.

| Preset field     | Value              |
| ---------------- | ------------------ |
| `entry`          | `["src/index.ts"]` |
| `format`         | `["esm", "cjs"]`   |
| `dts`            | `true`             |
| `sourcemap`      | `true`             |
| `clean`          | `true`             |
| `platform`       | `"neutral"`        |
| `fixedExtension` | `false`            |

The preset leaves `deps` unset, so tsdown leaves `dependencies`, `peerDependencies`, and `optionalDependencies` external. It writes a new config object and leaves `options` unchanged. It writes the build config, and the caller writes the package `exports` map.

Pass a plain object. Each field replaces that preset field. Arrays and nested objects are replaced as a whole. `fixedExtension` stays false unless the caller sets it, including when the caller sets `platform`. A function, a promise, an array, or `null` throws `TypeError`. The message names `options` and the received value. Spreading those values would drop the caller's overrides and return the preset alone.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Runtime support

The preset `platform` is `"neutral"` for universal and edge libraries. Node libraries pass `{ platform: "node" }`. This package itself is Node tooling. `engines.node` is `>=22.12`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Repository rules are in [CONTRIBUTING.md](../../../CONTRIBUTING.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

[MIT](../../../LICENSE) © 2026 Subhajit Ghosh (`@sgx4u`).

<p align="right">(<a href="#readme-top">back to top</a>)</p>
