# `interpolateSmootherstep`

Interpolates with the Ken Perlin smootherstep curve after clamping `amount` to `[0, 1]`.

## Import

```ts
import { interpolateSmootherstep } from "@sgx4u/number";
```

## Signature

```ts
function interpolateSmootherstep(parameters: {
    start: number;
    end: number;
    amount: number;
}): number | undefined;
```

## Examples

```ts
interpolateSmootherstep({ start: 0, end: 10, amount: 0.5 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `interpolateSmoothstep`
