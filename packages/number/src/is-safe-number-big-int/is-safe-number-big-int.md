# `isSafeNumberBigInt`

Reports whether a bigint is inside the safe integer range.

## Import

```ts
import { isSafeNumberBigInt } from "@sgx4u/number";
```

## Signature

```ts
function isSafeNumberBigInt(value: bigint): boolean;
```

## Examples

```ts
isSafeNumberBigInt(1n);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `bigIntToNumber`
