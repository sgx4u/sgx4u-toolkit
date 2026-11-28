# `damp`

Frame-rate independent exponential smoothing. `smoothing` is the time constant in the same unit as `deltaTime`. After one time constant, about 37% of the gap remains. A smoothing of `0` snaps to `target`.

## Import

```ts
import { damp } from "@sgx4u/number";
```

## Signature

```ts
function damp(parameters: {
    current: number;
    target: number;
    smoothing: number;
    deltaTime: number;
}): number | undefined;
```

## Examples

```ts
damp({ current: 0, target: 10, smoothing: 1, deltaTime: 1 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `interpolateLinear`
