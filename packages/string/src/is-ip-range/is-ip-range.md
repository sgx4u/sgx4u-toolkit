# `isIPRange`

Reports whether a string is a CIDR range.

## Import

```ts
import { isIPRange } from "@sgx4u/string";
```

## Signature

```ts
function isIPRange(value: unknown): boolean;
```

## Examples

```ts
isIPRange("value");
```

## Edge cases

A non-string returns `false`.
