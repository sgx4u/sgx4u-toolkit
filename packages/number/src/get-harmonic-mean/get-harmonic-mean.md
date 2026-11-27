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

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getGeometricMean`
- `mean`
