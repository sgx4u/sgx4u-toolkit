# `maskCreditCard`

Masks card digits and keeps spaces and hyphens. The last four digits stay visible by default.

## Import

```ts
import { maskCreditCard } from "@sgx4u/string";
```

## Signature

```ts
function maskCreditCard(value: string): string | undefined;
```

## Examples

```ts
maskCreditCard("4242 4242 4242 4242");
```

## Edge cases

A string with no digits returns `undefined`.
