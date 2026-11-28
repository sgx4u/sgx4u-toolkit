# `isNaNNumber`

Reports whether a value is the number `NaN`.

## Import

```ts
import { isNaNNumber } from "@sgx4u/number";
```

## Signature

```ts
function isNaNNumber(value: unknown): boolean;
```

## Examples

```ts
isNaNNumber(Number.NaN); // true
isNaNNumber("NaN"); // false
```

## Edge cases

- The global `isNaN` coerces strings. This function does not.
- Infinities return `false`.

## Related

- `isNumber`
- `isFiniteNumber`
