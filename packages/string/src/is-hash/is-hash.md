# `isHash`

Reports whether a string is hexadecimal of the length for a named hash. `algorithm` is required.

## Import

```ts
import { isHash } from "@sgx4u/string";
```

## Signature

```ts
function isHash(value: unknown): boolean;
```

## Examples

```ts
isHash("value");
```

## Edge cases

A non-string returns `false`.
