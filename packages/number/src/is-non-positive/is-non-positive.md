# `isNonPositive`

Reports whether `value` is a number less than or equal to zero. This includes `0` and `-0`.

## Import

```ts
import { isNonPositive } from "@sgx4u/number";
```

## Signature

```ts
function isNonPositive(value: unknown): boolean;
```

## Examples

```ts
isNonPositive(0);
```

## Edge cases

- Non-numbers return `false`.
- The function does not throw.

## Related

- `isNonNegative`
- `isNegative`
