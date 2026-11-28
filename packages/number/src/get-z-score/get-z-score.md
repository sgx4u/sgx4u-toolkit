# `getZScore`

Returns the z-score from `values`, or from `mean` and `standardDeviation`. A deviation of zero returns `undefined`.

## Import

```ts
import { getZScore } from "@sgx4u/number";
```

## Signature

```ts
function getZScore(parameters: {
    value: number;
    values?: readonly number[];
    mean?: number;
    standardDeviation?: number;
    sample?: boolean;
}): number | undefined;
```

## Examples

```ts
getZScore({ value: 2, mean: 0, standardDeviation: 1 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getStandardDeviation`
- `mean`
