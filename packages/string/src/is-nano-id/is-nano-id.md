# `isNanoID`

Reports whether a string is a Nano ID of the given length and alphabet.

## Import

```ts
import { isNanoID } from "@sgx4u/string";
```

## Signature

```ts
function isNanoID(value: unknown): boolean;
```

## Examples

```ts
isNanoID("value");
```

## Edge cases

A non-string returns `false`.
