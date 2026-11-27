# `isPositive`

Reports whether `value` is a number greater than zero. Zero, `-0`, `NaN`, and non-numbers return `false`.

## Import

```ts
import { isPositive } from "@sgx4u/number";
```

## Signature

```ts
function isPositive(value: unknown): boolean;
```

## Examples

```ts
isPositive(1);
```

## Edge cases

- Non-numbers return `false`.
- The function does not throw.

## Related

- `isNegative`
- `isNonNegative`
