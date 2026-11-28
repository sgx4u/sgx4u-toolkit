# `interpolateAngle`

Interpolates the shortest path around a circle. `unit` is `radians` by default, or `degrees`.

## Import

```ts
import { interpolateAngle } from "@sgx4u/number";
```

## Signature

```ts
function interpolateAngle(parameters: {
    start: number;
    end: number;
    amount: number;
    unit?: "radians" | "degrees";
}): number | undefined;
```

## Examples

```ts
interpolateAngle({ start: 350, end: 10, amount: 0.5, unit: "degrees" });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `interpolateLinear`
- `wrapNumber`
