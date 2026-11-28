# `remapRange`

Maps `value` linearly from `[fromStart, fromEnd]` onto `[toStart, toEnd]`. `amount` is not involved; the source position is the ratio. Set `clamp` to clamp the input to the source range first.

## Import

```ts
import { remapRange } from "@sgx4u/number";
```

## Signature

```ts
function remapRange(parameters: {
    value: number;
    fromStart: number;
    fromEnd: number;
    toStart: number;
    toEnd: number;
    clamp?: boolean;
}): number | undefined;
```

## Examples

```ts
remapRange({ value: 5, fromStart: 0, fromEnd: 10, toStart: 0, toEnd: 100 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `normalize`
- `interpolateLinear`
