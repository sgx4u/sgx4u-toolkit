# `areAlmostEqual`

Reports whether two finite numbers are within the absolute or relative tolerance. Defaults are `absoluteTolerance` `0` and `relativeTolerance` `Number.EPSILON * 8`.

## Import

```ts
import { areAlmostEqual } from "@sgx4u/number";
```

## Signature

```ts
function areAlmostEqual(parameters: {
    first: number;
    second: number;
    absoluteTolerance?: number;
    relativeTolerance?: number;
}): boolean;
```

## Examples

```ts
areAlmostEqual({ first: 0.1 + 0.2, second: 0.3 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `stripImpreciseRemainder`
