# @sgx4u/prettier-config

Shared Prettier options: semicolons, double quotes, trailing commas, 80 columns, and a four-space indent.

`tabWidth` is 4 because that is the repository indent. Prettier's own default is 2, so a checkout that does not load `.editorconfig` would otherwise disagree with this repo. The other options match Prettier 3 defaults and stay written down so a later Prettier default does not reformat consumers.

## Install

```sh
pnpm add -D @sgx4u/prettier-config prettier
```

## Examples

```json
{
    "prettier": "@sgx4u/prettier-config"
}
```

## Owner

Subhajit Ghosh (`@sgx4u`).

## Status

Experimental (`0.x`).
