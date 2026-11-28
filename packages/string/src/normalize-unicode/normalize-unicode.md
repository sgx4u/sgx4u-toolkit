# `normalizeUnicode`

Returns a string in NFC, NFD, NFKC, or NFKD. The default is NFC. Normalizing twice does not change the result.

## Import

```ts
import { normalizeUnicode } from "@sgx4u/string";
```

## Signature

```ts
function normalizeUnicode(value: string): string | undefined;
```

## Examples

```ts
normalizeUnicode("e\u0301");
```

## Edge cases

An unknown `form` throws `RangeError`. A non-string returns `undefined`.
