# `isOdd`

Reports whether `value` is a finite odd integer. Fractions and non-numbers return `false`.

## Import

```ts
import { isOdd } from "@sgx4u/number";
```

## Signature

```ts
function isOdd(value: unknown): boolean;
```

## Examples

```ts
isOdd(3);
```

## Edge cases

- Non-numbers return `false`.
- The function does not throw.

## Related

- `isEven`
