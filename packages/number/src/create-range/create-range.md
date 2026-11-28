# `createRange`

Creates the half-open sequence `[start, end)`. `start` defaults to 0 and `step` defaults to 1. Decimal steps use decimal arithmetic, so a step of `0.1` does not drift.

## Import

```ts
import { createRange } from "@sgx4u/number";
```

## Signature

```ts
function createRange(parameters: {
    start?: number;
    end: number;
    step?: number;
}): number[];
```

## Examples

```ts
createRange({ end: 3 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `createInclusiveRange`
- `createBigIntRange`
