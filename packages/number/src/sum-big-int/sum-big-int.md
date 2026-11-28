# `sumBigInt`

Sums bigints. An empty list is `0n`.

## Import

```ts
import { sumBigInt } from "@sgx4u/number";
```

## Signature

```ts
function sumBigInt(values: readonly bigint[]): bigint;
```

## Examples

```ts
sumBigInt([1n, 2n]);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `sum`
