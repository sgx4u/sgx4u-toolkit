# `clampBigInt`

Clamps a bigint to an inclusive range.

## Import

```ts
import { clampBigInt } from "@sgx4u/number";
```

## Signature

```ts
function clampBigInt(parameters: {
    value: bigint;
    lower: bigint;
    upper: bigint;
}): bigint | undefined;
```

## Examples

```ts
clampBigInt({ value: 5n, lower: 0n, upper: 3n });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `clamp`
- `isInRangeBigInt`
