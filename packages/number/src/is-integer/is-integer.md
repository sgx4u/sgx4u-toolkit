# `isInteger`

Reports whether a value is an integer number.

## Import

```ts
import { isInteger } from "@sgx4u/number";
```

## Signature

```ts
function isInteger(value: unknown): value is number;
```

## Examples

```ts
isInteger(-3); // true
isInteger(1.5); // false
```

## Edge cases

- `1.0` is an integer.
- `NaN` and non-numbers return `false`.

## Related

- `isSafeInteger`
- `parseInteger`
