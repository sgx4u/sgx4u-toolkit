# `getStandardDeviation`

Returns the square root of {@link getVariance}.

## Import

```ts
import { getStandardDeviation } from "@sgx4u/number";
```

## Signature

```ts
function getStandardDeviation(parameters: {
    values: readonly number[];
    sample?: boolean;
}): number | undefined;
```

## Examples

```ts
getStandardDeviation({ values: [1, 2, 3] });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getVariance`
- `getZScore`
