# `isInRangeBigInt`

Reports whether a bigint lies in a half-open range by default.

## Import

```ts
import { isInRangeBigInt } from "@sgx4u/number";
```

## Signature

```ts
function isInRangeBigInt(parameters: {
    value: bigint;
    start: bigint;
    end: bigint;
    includeStart?: boolean;
    includeEnd?: boolean;
}): boolean;
```

## Examples

```ts
isInRangeBigInt({ value: 1n, start: 0n, end: 2n });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `isInRange`
- `clampBigInt`
