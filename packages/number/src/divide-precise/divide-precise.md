# `dividePrecise`

Divides two decimal values. A divisor of `0` or `-0` returns `undefined`. A repeating result is rounded to 15 fractional digits, ties away from zero.

## Import

```ts
import { dividePrecise } from "@sgx4u/number";
```

## Signature

```ts
function dividePrecise(parameters: {
    first: number;
    second: number;
}): number | undefined;
```

## Examples

```ts
dividePrecise({ first: 1, second: 2 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `multiplyPrecise`
- `getRemainder`
