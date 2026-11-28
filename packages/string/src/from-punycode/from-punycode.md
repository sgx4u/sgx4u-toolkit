# `fromPunycode`

The Unicode domain, or `undefined` when a label cannot be decoded.

## Import

```ts
import { fromPunycode } from "@sgx4u/string";
```

## Signature

```ts
function fromPunycode(value: unknown): string | undefined;
```

## Examples

```ts
fromPunycode("hi");
```

## Edge cases

A non-string returns `undefined`.
