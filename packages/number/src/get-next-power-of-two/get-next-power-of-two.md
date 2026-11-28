# `getNextPowerOfTwo`

Returns the smallest power of two that is greater than or equal to a positive finite `value`.

## Import

```ts
import { getNextPowerOfTwo } from "@sgx4u/number";
```

## Signature

```ts
function getNextPowerOfTwo(value: number): number | undefined;
```

## Examples

```ts
getNextPowerOfTwo(5);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `isPowerOfTwo`
