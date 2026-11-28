# `isCamelCase`

Reports whether a non-empty string is unchanged by `toCamelCase`.

## Import

```ts
import { isCamelCase } from "@sgx4u/string";
```

## Signature

```ts
function isCamelCase(value: unknown): boolean;
```

## Examples

```ts
isCamelCase("value");
```

## Edge cases

An empty string and a non-string return `false`.
