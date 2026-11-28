# `maskString`

Masks the middle of a string. Overlapping unmasked lengths leave the whole string visible.

## Import

```ts
import { maskString } from "@sgx4u/string";
```

## Signature

```ts
function maskString(value: string): string | undefined;
```

## Examples

```ts
maskString({ value: "secret", unmaskedStartLength: 1, unmaskedEndLength: 1 });
```

## Edge cases

An empty mask character throws `RangeError`.
