# `interpolateAlongValues`

Walks a piecewise-linear path through `values` as `amount` goes from 0 to 1. Amounts outside that interval extrapolate from the first or last segment.

## Import

```ts
import { interpolateAlongValues } from "@sgx4u/number";
```

## Signature

```ts
function interpolateAlongValues(parameters: {
    values: readonly number[];
    amount: number;
}): number | undefined;
```

## Examples

```ts
interpolateAlongValues({ values: [0, 10, 30], amount: 0.5 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `interpolateLinear`
