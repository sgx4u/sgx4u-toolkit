# `isPascalCase`

Reports whether a non-empty string is unchanged by `toPascalCase`.

## Import

```ts
import { isPascalCase } from "@sgx4u/string";
```

## Signature

```ts
function isPascalCase(value: unknown): boolean;
```

## Examples

```ts
isPascalCase("value");
```

## Edge cases

An empty string and a non-string return `false`.
