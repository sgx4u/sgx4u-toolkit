# `isNonNegative`

Reports whether `value` is a number greater than or equal to zero. This includes `0` and `-0`.

## Import

```ts
import { isNonNegative } from "@sgx4u/number";
```

## Signature

```ts
function isNonNegative(value: unknown): boolean;
```

## Examples

```ts
isNonNegative(0);
```

## Edge cases

- Non-numbers return `false`.
- The function does not throw.

## Related

- `isNonPositive`
- `isPositive`
