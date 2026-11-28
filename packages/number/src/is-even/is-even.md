# `isEven`

Reports whether `value` is a finite even integer. Fractions and non-numbers return `false`.

## Import

```ts
import { isEven } from "@sgx4u/number";
```

## Signature

```ts
function isEven(value: unknown): boolean;
```

## Examples

```ts
isEven(2);
```

## Edge cases

- Non-numbers return `false`.
- The function does not throw.

## Related

- `isOdd`
- `isInteger`
