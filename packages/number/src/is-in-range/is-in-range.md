# `isInRange`

Reports whether `value` lies in the range. The range is half-open `[start, end)` unless `includeStart` or `includeEnd` says otherwise.

## Import

```ts
import { isInRange } from "@sgx4u/number";
```

## Signature

```ts
function isInRange(parameters: {
    value: number;
    start: number;
    end: number;
    includeStart?: boolean;
    includeEnd?: boolean;
}): boolean;
```

## Examples

```ts
isInRange({ value: 1, start: 0, end: 2 });
```

## Edge cases

- Any non-finite argument returns `false`.
- A backwards range contains nothing.

## Related

- `clamp`
- `isInRangeBigInt`
