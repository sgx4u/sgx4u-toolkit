# `isSnakeCase`

Reports whether a non-empty string is unchanged by `toSnakeCase`.

## Import

```ts
import { isSnakeCase } from "@sgx4u/string";
```

## Signature

```ts
function isSnakeCase(value: unknown): boolean;
```

## Examples

```ts
isSnakeCase("value");
```

## Edge cases

An empty string and a non-string return `false`.
