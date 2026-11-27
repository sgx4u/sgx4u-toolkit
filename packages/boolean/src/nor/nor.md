# `nor`

The negation of [`any`](../any/any.md). A non-boolean entry returns `undefined`. The array is read and left unchanged. `true` for `[]`, because `any([])` is `false`.

## Import

```ts
import { nor } from "@sgx4u/boolean";
```

## Signature

```ts
function nor(values: readonly unknown[]): boolean | undefined;
```

## Examples

```ts
nor([]); // true
nor([true, false]);
```

## Edge cases

| Call                                                       | Result             |
| ---------------------------------------------------------- | ------------------ |
| `[]`                                                       | `true`             |
| An entry that is not a primitive boolean, including a hole | `undefined`        |
| `new Boolean(true)` inside the list                        | `undefined`        |
| A non-array, including `null` and an array-like object     | throws `TypeError` |
