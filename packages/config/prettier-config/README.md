<a id="readme-top"></a>

<div align="center">
    <a href="https://github.com/sgx4u/sgx4u-toolkit">
        <img src="https://github.com/sgx4u/sgx4u-toolkit/blob/develop/logo.svg?raw=true" width="75" alt="SGX4U" />
    </a>

<h1 align="center">🌟 @sgx4u/prettier-config 🌟</h1>

<p align="center">Prettier preset for <code>@sgx4u</code> repositories.</p>

<p align="center">
    <a href="../../../.github/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/sgx4u/sgx4u-toolkit/ci.yml?branch=develop&style=for-the-badge&label=ci&labelColor=353535" alt="ci" /></a>
    <a href="../../../LICENSE"><img src="https://img.shields.io/github/license/sgx4u/sgx4u-toolkit?style=for-the-badge&labelColor=353535&color=4f46e5" alt="License: MIT" /></a>
    <a href="./package.json"><img src="https://img.shields.io/badge/node-%3E%3D22.12-339933?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=353535" alt="Node &gt;=22.12" /></a>
</p>

<p align="center">Part of <a href="../../../README.md">sgx4u-toolkit</a>.</p>
</div>

## About

Shared Prettier options: semicolons, double quotes, trailing commas, 80 columns, and a four-space indent.

`tabWidth` is 4, matching the repository indent in `.editorconfig`. The other options match Prettier 3 defaults and are set here so a later Prettier default keeps the same format.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Installation

`prettier` is a peer dependency at `^3.0.0`.

This preset lives in this repository and is a workspace dev dependency of the packages here. It is not published.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

```json
{
    "prettier": "@sgx4u/prettier-config"
}
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## API

The package default export is the options object.

| Option          | Value      |
| --------------- | ---------- |
| `semi`          | `true`     |
| `singleQuote`   | `false`    |
| `trailingComma` | `"all"`    |
| `printWidth`    | `80`       |
| `arrowParens`   | `"always"` |
| `tabWidth`      | `4`        |

`import` loads `index.js` with `index.d.ts`. Prettier loads that entry directly.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Runtime support

Node tooling. `engines.node` is `>=22.12`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Repository rules are in [CONTRIBUTING.md](../../../CONTRIBUTING.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

[MIT](../../../LICENSE) © 2026 Subhajit Ghosh (`@sgx4u`).

<p align="right">(<a href="#readme-top">back to top</a>)</p>
