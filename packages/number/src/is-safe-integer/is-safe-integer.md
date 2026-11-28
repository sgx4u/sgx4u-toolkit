# `isSafeInteger`

Reports whether a value is a safe integer.

## Import

```ts
import { isSafeInteger } from "@sgx4u/number";
```

## Signature

```ts
function isSafeInteger(value: unknown): value is number;
```

## Examples

```ts
isSafeInteger(Number.MAX_SAFE_INTEGER); // true
isSafeInteger(1.5); // false
```

## Edge cases

- Values outside the safe integer range return `false`.
- Bigints return `false`.

## Related

- `isInteger`
- `isSafeNumberBigInt`
