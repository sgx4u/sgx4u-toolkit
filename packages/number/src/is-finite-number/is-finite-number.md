# `isFiniteNumber`

Reports whether a value is a finite number.

## Import

```ts
import { isFiniteNumber } from "@sgx4u/number";
```

## Signature

```ts
function isFiniteNumber(value: unknown): value is number;
```

## Examples

```ts
isFiniteNumber(1.5); // true
isFiniteNumber(Number.NaN); // false
```

## Edge cases

- `-0` is finite and returns `true`.
- Infinities and non-numbers return `false`.

## Related

- `isNumber`
- `parseFiniteNumber`
