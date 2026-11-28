# `isPowerOfTwo`

Reports whether a value is an integer power of two of at least 1.

## Import

```ts
import { isPowerOfTwo } from "@sgx4u/number";
```

## Signature

```ts
function isPowerOfTwo(value: unknown): boolean;
```

## Examples

```ts
isPowerOfTwo(8); // true
```

## Edge cases

- `1` is `2^0` and returns `true`.
- Fractions and numbers below 1 return `false`.

## Related

- `getNextPowerOfTwo`
