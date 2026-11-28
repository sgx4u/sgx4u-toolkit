# `interpolateSmoothstep`

Interpolates with the Hermite smoothstep curve after clamping `amount` to `[0, 1]`.

## Import

```ts
import { interpolateSmoothstep } from "@sgx4u/number";
```

## Signature

```ts
function interpolateSmoothstep(parameters: {
    start: number;
    end: number;
    amount: number;
}): number | undefined;
```

## Examples

```ts
interpolateSmoothstep({ start: 0, end: 10, amount: 0.5 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `interpolateSmootherstep`
- `interpolateLinear`
