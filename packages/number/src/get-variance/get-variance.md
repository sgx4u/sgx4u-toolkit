# `getVariance`

Returns the variance. `sample` defaults to `true` and divides by `n - 1`. A sample with fewer than two values returns `undefined`. Population variance needs at least one value.

## Import

```ts
import { getVariance } from "@sgx4u/number";
```

## Signature

```ts
function getVariance(parameters: {
    values: readonly number[];
    sample?: boolean;
}): number | undefined;
```

## Examples

```ts
getVariance({ values: [1, 2, 3] });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getStandardDeviation`
- `mean`
