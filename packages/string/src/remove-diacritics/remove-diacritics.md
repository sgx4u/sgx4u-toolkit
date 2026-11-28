# `removeDiacritics`

Removes combining marks after NFD and maps sharp s, AE, O-slash, eth, thorn, L-stroke, and OE to ASCII.

## Import

```ts
import { removeDiacritics } from "@sgx4u/string";
```

## Signature

```ts
function removeDiacritics(value: unknown): string | undefined;
```

## Examples

```ts
removeDiacritics("café");
```

## Edge cases

A non-string returns `undefined`.
