# `isKebabCase`

Reports whether a non-empty string is unchanged by `toKebabCase`.

## Import

```ts
import { isKebabCase } from "@sgx4u/string";
```

## Signature

```ts
function isKebabCase(value: unknown): boolean;
```

## Examples

```ts
isKebabCase("value");
```

## Edge cases

An empty string and a non-string return `false`.
