# `exactlyOne`

True when precisely one entry is `true`. A non-boolean entry returns `undefined`. The array is read and left unchanged. `false` for `[]`. This is what most callers want from "xor" once a list has more than two values.

## Import

```ts
import { exactlyOne } from "@sgx4u/boolean";
```

## Signature

```ts
function exactlyOne(values: readonly unknown[]): boolean | undefined;
```

## Examples

```ts
exactlyOne([]); // false
exactlyOne([true, false]);
```

## Edge cases

| Call                                                       | Result             |
| ---------------------------------------------------------- | ------------------ |
| `[]`                                                       | `false`            |
| An entry that is not a primitive boolean, including a hole | `undefined`        |
| `new Boolean(true)` inside the list                        | `undefined`        |
| A non-array, including `null` and an array-like object     | throws `TypeError` |
