# `bigIntToNumber`

Converts a bigint to a number when it is inside the safe integer range.

## Import

```ts
import { bigIntToNumber } from "@sgx4u/number";
```

## Signature

```ts
function bigIntToNumber(value: bigint): number | undefined;
```

## Examples

```ts
bigIntToNumber(12n);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `toBigInt`
- `isSafeNumberBigInt`
