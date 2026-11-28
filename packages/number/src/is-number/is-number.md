# `isNumber`

Reports whether a value is a number, including `NaN` and infinities.

## Import

```ts
import { isNumber } from "@sgx4u/number";
```

## Signature

```ts
function isNumber(value: unknown): value is number;
```

## Examples

```ts
isNumber(1); // true
isNumber(Number.NaN); // true
isNumber("1"); // false
```

## Edge cases

- `NaN` and both infinities return `true`.
- Strings, bigints, booleans, `null`, and `undefined` return `false`.

## Related

- `isFiniteNumber`
- `isNaNNumber`
- `parseNumber`
