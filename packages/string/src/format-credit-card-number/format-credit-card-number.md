# `formatCreditCardNumber`

Groups the digits of a card number into fours.

## Import

```ts
import { formatCreditCardNumber } from "@sgx4u/string";
```

## Signature

```ts
function formatCreditCardNumber(value: unknown): string | undefined;
```

## Examples

```ts
formatCreditCardNumber("4242424242424242");
```

## Edge cases

No digits returns `undefined`.
