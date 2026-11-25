# @sgx4u/prettier-config

Internal Prettier preset for this repository. Options: semicolons, double quotes, trailing commas, 80 columns, and a four-space indent.

`tabWidth` is 4, matching the repository indent in `.editorconfig`. The other options match Prettier 3 defaults and are set here so a later Prettier default keeps the same format.

`import` loads `index.js` with `index.d.ts`. `require` loads `dist/index.cjs` with `dist/index.d.cts`. The ESM entry stays `index.js` so Prettier can load this package before a build.

Workspace dev dependency. Peer is `prettier` at `^3.0.0`. Node `>=22.12`.

## Usage

```json
{
    "prettier": "@sgx4u/prettier-config"
}
```

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

## Runtime support

Node tooling. `engines.node` is `>=22.12`.

## Contributing

Repository rules are in [CONTRIBUTING.md](../../../CONTRIBUTING.md).

## License

[MIT](../../../LICENSE) © 2026 Subhajit Ghosh (`@sgx4u`).
