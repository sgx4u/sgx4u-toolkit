<a id="readme-top"></a>

<div align="center">
    <a href="https://github.com/sgx4u/sgx4u-toolkit">
        <img src="https://github.com/sgx4u/sgx4u-toolkit/blob/develop/logo.svg?raw=true" width="75" alt="SGX4U" />
    </a>

<h1 align="center">🌟 @sgx4u/date-time 🌟</h1>

<h3 align="center">Reports whether a value is a real date.</h3>

<p align="center">
    <a href="../../.github/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/sgx4u/sgx4u-toolkit/ci.yml?branch=develop&style=for-the-badge&label=ci&labelColor=353535" alt="ci" /></a>
    <a href="../../LICENSE"><img src="https://img.shields.io/github/license/sgx4u/sgx4u-toolkit?style=for-the-badge&labelColor=353535&color=4f46e5" alt="License: MIT" /></a>
    <a href="./package.json"><img src="https://img.shields.io/badge/node-%3E%3D22.12-339933?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=353535" alt="Node &gt;=22.12" /></a>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

<p align="center">Part of <a href="../../README.md">@sgx4u/toolkit</a>.</p>
</div>

<br />

<h2 id="about">💫 About</h2>

`@sgx4u/date-time` checks whether a value is a real date. `isValidDate` accepts a `Date`, a millisecond timestamp, or a calendar or ISO date-time string. It returns a boolean and does not throw.

Experimental (`0.x`). Breaking changes may land in minor versions until 1.0.0.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="installation">📥 Installation</h2>

```sh
pnpm add @sgx4u/date-time       # pnpm
npm install @sgx4u/date-time    # npm
yarn add @sgx4u/date-time       # yarn
```

Requires Node `>=22.12`. The package publishes ESM (`import`) and CommonJS (`require`).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="usage">💡 Usage</h2>

```ts
import { isValidDate } from "@sgx4u/date-time";

isValidDate("2024-02-29"); // true
isValidDate("2024-02-30"); // false
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="functions">📘 Functions</h2>

- [`isValidDate`](./src/is-valid-date/is-valid-date.md) reports whether a `Date`, a millisecond timestamp, or a date string is a real date.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="runtime-support">🌐 Runtime support</h2>

Runtime: `universal`. The same source runs in browsers, workers, and Node. It uses `Date` and has no runtime dependencies.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="contributing">🤝 Contributing</h2>

Repository rules are in [CONTRIBUTING.md](../../CONTRIBUTING.md).

Owner: `@sgx4u`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="license">📄 License</h2>

[MIT](../../LICENSE) © 2026 Subhajit Ghosh

<p align="right">(<a href="#readme-top">back to top</a>)</p>
