# `getQuotientAndRemainder`

Returns toward-zero quotient and the JavaScript remainder. A divisor of zero returns `undefined`.

## Import

```ts
import { getQuotientAndRemainder } from "@sgx4u/number";
```

## Signature

```ts
function getQuotientAndRemainder(parameters: {
    dividend: number;
    divisor: number;
}): QuotientAndRemainder | undefined;
```

## Examples

```ts
getQuotientAndRemainder({ dividend: 5, divisor: 2 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getRemainder`
- `getModulo`
