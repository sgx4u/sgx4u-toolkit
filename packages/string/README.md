<a id="readme-top"></a>

<div align="center">
    <a href="https://github.com/sgx4u/sgx4u-toolkit">
        <img src="https://github.com/sgx4u/sgx4u-toolkit/blob/develop/logo.svg?raw=true" width="75" alt="SGX4U" />
    </a>

<h1 align="center">🌟 @sgx4u/string 🌟</h1>

<h3 align="center">String helpers for browsers, Node 22.12+, Cloudflare Workers, and React Native.</h3>

<p align="center">
    <a href="../../.github/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/sgx4u/sgx4u-toolkit/ci.yml?branch=develop&style=for-the-badge&label=ci&labelColor=353535" alt="ci" /></a>
    <a href="../../LICENSE"><img src="https://img.shields.io/github/license/sgx4u/sgx4u-toolkit?style=for-the-badge&labelColor=353535&color=4f46e5" alt="License: MIT" /></a>
    <a href="./package.json"><img src="https://img.shields.io/badge/node-%3E%3D22.12-339933?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=353535" alt="Node &gt;=22.12" /></a>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

<p align="center">Part of <a href="../../README.md">sgx4u-toolkit</a>.</p>
</div>

<br />

<h2 id="about">💫 About</h2>

`isBlank` and `collapseWhitespace` are the public functions. `src/index.ts` re-exports both. Each one lives in its own folder under `src`, with the test beside the implementation.

The export map lists `@sgx4u/source` before `import` and `require`, pointing at `src/index.ts`. TypeScript uses that condition when `customConditions` includes `@sgx4u/source`. The TypeScript configuration in this repository sets that condition, so workspace builds load the source. Other resolvers load `dist`. `types` stays under `import` and `require`, after `@sgx4u/source`, so the source condition stays reachable.

Experimental (`0.x`). Breaking changes may land in minor versions until 1.0.0.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="installation">📥 Installation</h2>

```sh
pnpm add @sgx4u/string       # pnpm
npm install @sgx4u/string    # npm
yarn add @sgx4u/string       # yarn
```

Node 22.12 or newer. `import` loads the ESM build. `require()` loads the CommonJS build.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="usage">💡 Usage</h2>

```ts
import { collapseWhitespace, isBlank } from "@sgx4u/string";

isBlank("  "); // true
collapseWhitespace("  a \n b  "); // "a b"
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="api">📘 API</h2>

| Export               | Signature                    | Behavior                                                                                                                                 |
| -------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `isBlank`            | `(value: string) => boolean` | Returns true when `value` is empty or only whitespace. Whitespace is the set `String.prototype.trim` removes. `value` is left unchanged. |
| `collapseWhitespace` | `(value: string) => string`  | Trims `value` and replaces each internal whitespace run with a single space. Whitespace is the same set. `value` is left unchanged.      |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="runtime-support">🌐 Runtime support</h2>

The same source runs in browsers, Node 22.12+, Cloudflare Workers, and React Native.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="contributing">🤝 Contributing</h2>

Repository rules are in [CONTRIBUTING.md](../../CONTRIBUTING.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="license">📄 License</h2>

[MIT](../../LICENSE) © 2026 Subhajit Ghosh (`@sgx4u`).

<p align="right">(<a href="#readme-top">back to top</a>)</p>
