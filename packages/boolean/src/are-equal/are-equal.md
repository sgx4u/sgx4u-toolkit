# `areEqual`

True when every entry is the same boolean. A non-boolean entry returns `undefined`. The array is read and left unchanged. `true` for `[]` and for a list of one boolean. This is what most callers want from "xnor" once a list has more than two values.

## Import

```ts
import { areEqual } from "@sgx4u/boolean";
```

## Signature

```ts
function areEqual(values: readonly unknown[]): boolean | undefined;
```

## Examples

```ts
areEqual([]); // true
areEqual([true, false]);
```

## Edge cases

| Call                                                       | Result             |
| ---------------------------------------------------------- | ------------------ |
| `[]`                                                       | `true`             |
| An entry that is not a primitive boolean, including a hole | `undefined`        |
| `new Boolean(true)` inside the list                        | `undefined`        |
| A non-array, including `null` and an array-like object     | throws `TypeError` |
