# `getGreatestCommonDivisorBigInt`

Returns the non-negative greatest common divisor of two or more bigints.

## Import

```ts
import { getGreatestCommonDivisorBigInt } from "@sgx4u/number";
```

## Signature

```ts
function getGreatestCommonDivisorBigInt(parameters: {
    values: readonly bigint[];
}): bigint | undefined;
```

## Examples

```ts
getGreatestCommonDivisorBigInt({ values: [12n, 18n] });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getGreatestCommonDivisor`
