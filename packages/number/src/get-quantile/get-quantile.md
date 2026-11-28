# `getQuantile`

Returns a quantile for a probability from 0 to 1. The default method is `linear`.

## Import

```ts
import { getQuantile } from "@sgx4u/number";
```

## Signature

```ts
function getQuantile(parameters: {
    values: readonly number[];
    probability: number;
    method?: QuantileMethod;
}): number | undefined;
```

## Examples

```ts
getQuantile({ values: [1, 2, 3, 4], probability: 0.5 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getPercentile`
