# `createBigIntRange`

Creates the half-open bigint sequence `[start, end)`. `step` defaults to `1n`. A sequence longer than 1000000 throws.

## Import

```ts
import { createBigIntRange } from "@sgx4u/number";
```

## Signature

```ts
function createBigIntRange(parameters: {
    start: bigint;
    end: bigint;
    step?: bigint;
}): bigint[];
```

## Examples

```ts
createBigIntRange({ start: 0n, end: 3n });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `createRange`
