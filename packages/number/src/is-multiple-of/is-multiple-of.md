# `isMultipleOf`

Reports whether a finite integer is a multiple of another finite integer.

## Import

```ts
import { isMultipleOf } from "@sgx4u/number";
```

## Signature

```ts
function isMultipleOf(parameters: { value: number; divisor: number }): boolean;
```

## Examples

```ts
isMultipleOf({ value: 10, divisor: 5 }); // true
```

## Edge cases

- A divisor of `0` returns `false`.
- Fractions return `false`.

## Related

- `isEven`
- `getRemainder`
