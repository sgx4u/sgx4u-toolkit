# `wrapNumber`

Maps `value` into the half-open interval `[lower, upper)`. Useful for angles and cyclic indexes.

## Import

```ts
import { wrapNumber } from "@sgx4u/number";
```

## Signature

```ts
function wrapNumber(parameters: {
    value: number;
    lower: number;
    upper: number;
}): number | undefined;
```

## Examples

```ts
wrapNumber({ value: 370, lower: 0, upper: 360 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `clamp`
- `interpolateAngle`
