# `getModulo`

Returns a non-negative remainder for a non-zero divisor. A divisor of zero returns `undefined`.

## Import

```ts
import { getModulo } from "@sgx4u/number";
```

## Signature

```ts
function getModulo(parameters: {
    dividend: number;
    divisor: number;
}): number | undefined;
```

## Examples

```ts
getModulo({ dividend: -5, divisor: 2 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getRemainder`
