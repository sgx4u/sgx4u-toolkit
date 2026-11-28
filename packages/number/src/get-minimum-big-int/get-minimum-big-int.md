# `getMinimumBigInt`

Returns the smallest bigint. An empty list returns `undefined`.

## Import

```ts
import { getMinimumBigInt } from "@sgx4u/number";
```

## Signature

```ts
function getMinimumBigInt(values: readonly bigint[]): bigint | undefined;
```

## Examples

```ts
getMinimumBigInt([3n, 1n]);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getMaximumBigInt`
- `getMinimum`
