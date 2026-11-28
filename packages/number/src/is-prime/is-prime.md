# `isPrime`

Reports whether a value is a prime number.

## Import

```ts
import { isPrime } from "@sgx4u/number";
```

## Signature

```ts
function isPrime(value: unknown): boolean;
```

## Examples

```ts
isPrime(17); // true\nisPrime(1); // false
```

## Edge cases

- Numbers below 2 return `false`.
- Unsafe integers return `false`.

## Related

- `isInteger`
