# `isNegative`

Reports whether `value` is a number less than zero. Zero, `-0`, and non-numbers return `false`.

## Import

```ts
import { isNegative } from "@sgx4u/number";
```

## Signature

```ts
function isNegative(value: unknown): boolean;
```

## Examples

```ts
isNegative(-1);
```

## Edge cases

- Non-numbers return `false`.
- The function does not throw.

## Related

- `isPositive`
- `isNonPositive`
