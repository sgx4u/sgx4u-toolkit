# `createInclusiveRange`

Creates the closed sequence `[start, end]`. `end` is included when it lands on a step.

## Import

```ts
import { createInclusiveRange } from "@sgx4u/number";
```

## Signature

```ts
function createInclusiveRange(parameters: {
    start: number;
    end: number;
    step?: number;
}): number[];
```

## Examples

```ts
createInclusiveRange({ start: 0, end: 2 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `createRange`
