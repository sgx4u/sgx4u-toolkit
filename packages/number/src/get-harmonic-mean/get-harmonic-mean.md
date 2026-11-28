# `getHarmonicMean`

Returns the harmonic mean. An empty list or a zero value returns `undefined`.

## Import

```ts
import { getHarmonicMean } from "@sgx4u/number";
```

## Signature

```ts
function getHarmonicMean(values: readonly number[]): number | undefined;
```

## Examples

```ts
getHarmonicMean([1, 2]);
```

## Edge cases

- An empty list, a zero, a non-finite value, or a set whose reciprocals cancel to zero returns `undefined`.

## Related

- `getGeometricMean`
- `mean`
