# `interpolateLinear`

Returns `start + (end - start) * amount`. `amount` is not clamped, so the result can leave the segment.

## Import

```ts
import { interpolateLinear } from "@sgx4u/number";
```

## Signature

```ts
function interpolateLinear(parameters: {
    start: number;
    end: number;
    amount: number;
}): number | undefined;
```

## Examples

```ts
interpolateLinear({ start: 0, end: 10, amount: 0.5 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `interpolateInverse`
- `interpolateSmoothstep`
