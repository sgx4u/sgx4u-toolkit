# `clamp`

Clamps `value` to the inclusive interval `[lower, upper]`. `-0` is preserved when it is the bound that is hit or the value already inside the interval.

## Import

```ts
import { clamp } from "@sgx4u/number";
```

## Signature

```ts
function clamp(parameters: {
    value: number;
    lower: number;
    upper: number;
}): number | undefined;
```

## Examples

```ts
clamp({ value: 5, lower: 0, upper: 3 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `wrapNumber`
- `isInRange`
