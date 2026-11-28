# `toPunycode`

The ASCII hostname, or `undefined` when the input is not a domain.

## Import

```ts
import { toPunycode } from "@sgx4u/string";
```

## Signature

```ts
function toPunycode(value: unknown): string | undefined;
```

## Examples

```ts
toPunycode("hi");
```

## Edge cases

A non-string returns `undefined`.
