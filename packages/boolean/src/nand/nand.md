# `nand`

The negation of [`all`](../all/all.md). A non-boolean entry returns `undefined`. The array is read and left unchanged. `false` for `[]`, because `all([])` is `true`.

## Import

```ts
import { nand } from "@sgx4u/boolean";
```

## Signature

```ts
function nand(values: readonly unknown[]): boolean | undefined;
```

## Examples

```ts
nand([]); // false
nand([true, false]);
```

## Edge cases

| Call                                                       | Result             |
| ---------------------------------------------------------- | ------------------ |
| `[]`                                                       | `false`            |
| An entry that is not a primitive boolean, including a hole | `undefined`        |
| `new Boolean(true)` inside the list                        | `undefined`        |
| A non-array, including `null` and an array-like object     | throws `TypeError` |
