# `getPercentile`

Returns a percentile from 0 to 100. The default method is `linear`, Hyndman-Fan type 7. `inclusive` uses the same positions. `exclusive` is type 6.

## Import

```ts
import { getPercentile } from "@sgx4u/number";
```

## Signature

```ts
function getPercentile(parameters: {
    values: readonly number[];
    percentile: number;
    method?: QuantileMethod;
}): number | undefined;
```

## Examples

```ts
getPercentile({ values: [1, 2, 3, 4], percentile: 50 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getQuantile`
- `getQuartiles`
