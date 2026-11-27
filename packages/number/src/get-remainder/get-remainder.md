# `getRemainder`

Returns the JavaScript remainder. A divisor of `0` or `-0` returns `undefined`.

## Import

```ts
import { getRemainder } from "@sgx4u/number";
```

## Signature

```ts
function getRemainder(parameters: {
    dividend: number;
    divisor: number;
}): number | undefined;
```

## Examples

```ts
getRemainder({ dividend: 5, divisor: 2 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getModulo`
- `getQuotientAndRemainder`
