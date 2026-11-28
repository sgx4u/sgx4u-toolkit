# `getQuartiles`

Returns the 25%, 50%, and 75% points using the linear quantile method.

## Import

```ts
import { getQuartiles } from "@sgx4u/number";
```

## Signature

```ts
function getQuartiles(values: readonly number[]): Quartiles | undefined;
```

## Examples

```ts
getQuartiles([1, 2, 3, 4, 5]);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getPercentile`
- `getInterquartileRange`
