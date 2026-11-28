# `isIPv4`

Reports whether a string is IPv4. Leading zeros are rejected, except the octet `0`.

## Import

```ts
import { isIPv4 } from "@sgx4u/string";
```

## Signature

```ts
function isIPv4(value: unknown): boolean;
```

## Examples

```ts
isIPv4("value");
```

## Edge cases

A non-string returns `false`.
