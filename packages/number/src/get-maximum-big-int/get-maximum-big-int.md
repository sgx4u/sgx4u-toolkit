# `getMaximumBigInt`

Returns the largest bigint. An empty list returns `undefined`.

## Import

```ts
import { getMaximumBigInt } from "@sgx4u/number";
```

## Signature

```ts
function getMaximumBigInt(values: readonly bigint[]): bigint | undefined;
```

## Examples

```ts
getMaximumBigInt([3n, 1n]);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getMinimumBigInt`
