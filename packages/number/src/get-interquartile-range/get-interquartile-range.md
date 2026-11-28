# `getInterquartileRange`

Returns the distance between the upper and lower quartiles.

## Import

```ts
import { getInterquartileRange } from "@sgx4u/number";
```

## Signature

```ts
function getInterquartileRange(values: readonly number[]): number | undefined;
```

## Examples

```ts
getInterquartileRange([1, 2, 3, 4, 5]);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getQuartiles`
