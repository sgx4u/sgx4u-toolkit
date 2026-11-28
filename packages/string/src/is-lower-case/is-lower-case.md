# `isLowerCase`

Reports whether a string is already lower case and contains a cased letter.

## Import

```ts
import { isLowerCase } from "@sgx4u/string";
```

## Signature

```ts
function isLowerCase(value: unknown): boolean;
```

## Examples

```ts
isLowerCase("abc");
```

## Edge cases

Digits alone return `false`. The check uses the runtime locale.
