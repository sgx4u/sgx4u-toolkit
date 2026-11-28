# `isConstantCase`

Reports whether a non-empty string is unchanged by `toConstantCase`.

## Import

```ts
import { isConstantCase } from "@sgx4u/string";
```

## Signature

```ts
function isConstantCase(value: unknown): boolean;
```

## Examples

```ts
isConstantCase("value");
```

## Edge cases

An empty string and a non-string return `false`.
