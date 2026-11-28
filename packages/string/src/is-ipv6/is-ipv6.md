# `isIPv6`

Reports whether a string is IPv6, including a single `::` and an optional IPv4 tail.

## Import

```ts
import { isIPv6 } from "@sgx4u/string";
```

## Signature

```ts
function isIPv6(value: unknown): boolean;
```

## Examples

```ts
isIPv6("value");
```

## Edge cases

A non-string returns `false`.
