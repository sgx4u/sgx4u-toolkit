# `getGreatestCommonDivisor`

Returns the non-negative greatest common divisor of two or more safe integers.

## Import

```ts
import { getGreatestCommonDivisor } from "@sgx4u/number";
```

## Signature

```ts
function getGreatestCommonDivisor(parameters: {
    values: readonly number[];
}): number | undefined;
```

## Examples

```ts
getGreatestCommonDivisor({ values: [12, 18, 30] });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getLeastCommonMultiple`
