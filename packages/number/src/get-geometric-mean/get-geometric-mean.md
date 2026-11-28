# `getGeometricMean`

Returns the geometric mean. Any value that is not a positive finite number returns `undefined`.

## Import

```ts
import { getGeometricMean } from "@sgx4u/number";
```

## Signature

```ts
function getGeometricMean(values: readonly number[]): number | undefined;
```

## Examples

```ts
getGeometricMean([1, 4]);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getHarmonicMean`
- `mean`
