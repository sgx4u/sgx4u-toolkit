# `isCreditCard`

Reports whether a string looks like a card number: Luhn plus a known IIN length. This is not a complete IIN database.

## Import

```ts
import { isCreditCard } from "@sgx4u/string";
```

## Signature

```ts
function isCreditCard(value: unknown): boolean;
```

## Examples

```ts
isCreditCard("value");
```

## Edge cases

A non-string returns `false`.
