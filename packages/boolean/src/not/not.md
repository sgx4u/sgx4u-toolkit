# `not`

Negates a primitive boolean. [`toggle`](../toggle/toggle.md) returns the same result. `not` is the logic-gate name. A value that is not a primitive boolean returns `undefined`. The function does not coerce and never throws.

## Import

```ts
import { not } from "@sgx4u/boolean";
```

## Signature

```ts
function not(value: unknown): boolean | undefined;
```

## Examples

```ts
not(true); // false
not("true"); // undefined
```

## Edge cases

| Value                                       | Result      |
| ------------------------------------------- | ----------- |
| `true`                                      | `false`     |
| `false`                                     | `true`      |
| `0`, `"false"`, `null`, `new Boolean(true)` | `undefined` |
