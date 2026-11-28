# `isTruthy`

Reports whether a value is truthy under JavaScript `ToBoolean`. This is the opposite of [`isFalsy`](../is-falsy/is-falsy.md). The string `"false"` is truthy. A boxed boolean is truthy because it is an object. The function never throws.

## Import

```ts
import { isTruthy } from "@sgx4u/boolean";
```

## Signature

```ts
function isTruthy(value: unknown): boolean;
```

## Examples

```ts
isTruthy("false"); // true
isTruthy(0); // false
isTruthy([]); // true
```

## Edge cases

| Value                                                      | Result  |
| ---------------------------------------------------------- | ------- |
| `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN` | `false` |
| `"false"`, `"0"`, `[]`, `{}`, `new Boolean(false)`         | `true`  |
