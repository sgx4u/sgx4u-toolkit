# `isBoolean`

Reports whether a value is a primitive boolean. `true` and `false` return `true`. A boxed `Boolean`, a string, and the numbers `0` and `1` return `false`. The function never throws.

## Import

```ts
import { isBoolean } from "@sgx4u/boolean";
```

## Signature

```ts
function isBoolean(value: unknown): value is boolean;
```

## Examples

```ts
isBoolean(false); // true
isBoolean(new Boolean(false)); // false
isBoolean("true"); // false
```

## Edge cases

| Value                                     | Result  |
| ----------------------------------------- | ------- |
| `true`, `false`                           | `true`  |
| `new Boolean(true)`, `new Boolean(false)` | `false` |
| `0`, `1`, `"true"`, `null`, `undefined`   | `false` |
