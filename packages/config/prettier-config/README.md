# @sgx4u/prettier-config

Shared Prettier options: semicolons, double quotes, trailing commas, 80 columns, and a four-space indent.

`tabWidth` is 4, matching the repository indent in `.editorconfig`. The other options match Prettier 3 defaults and are set here so a later Prettier default keeps the same format.

`prettier` is a peer dependency at `^3.0.0`. This preset is a workspace dev dependency. It is not published.

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

`import` loads `index.js` with `index.d.ts`. Prettier loads that entry directly.
