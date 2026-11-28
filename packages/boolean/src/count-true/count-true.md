# `countTrue`

The number of `true` entries. A non-boolean entry returns `undefined`. The array is read and left unchanged. `0` for `[]`. A non-boolean does not produce a partial count.

## Import

```ts
import { countTrue } from "@sgx4u/boolean";
```

## Signature

```ts
function countTrue(values: readonly unknown[]): number | undefined;
```

## Examples

```ts
countTrue([]); // 0
countTrue([true, false]);
```

## Edge cases

| Call                                                       | Result             |
| ---------------------------------------------------------- | ------------------ |
| `[]`                                                       | `0`                |
| An entry that is not a primitive boolean, including a hole | `undefined`        |
| `new Boolean(true)` inside the list                        | `undefined`        |
| A non-array, including `null` and an array-like object     | throws `TypeError` |
