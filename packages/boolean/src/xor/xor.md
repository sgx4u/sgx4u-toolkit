# `xor`

True when an odd number of entries are `true`. A non-boolean entry returns `undefined`. The array is read and left unchanged. `false` for `[]`. For two values this is "different". For three or more it is parity, not "exactly one". [`exactlyOne`](../exactly-one/exactly-one.md) answers that question. `xor([true, true, true])` is `true`.

## Import

```ts
import { xor } from "@sgx4u/boolean";
```

## Signature

```ts
function xor(values: readonly unknown[]): boolean | undefined;
```

## Examples

```ts
xor([]); // false
xor([true, false]);
```

## Edge cases

| Call                                                       | Result             |
| ---------------------------------------------------------- | ------------------ |
| `[]`                                                       | `false`            |
| An entry that is not a primitive boolean, including a hole | `undefined`        |
| `new Boolean(true)` inside the list                        | `undefined`        |
| A non-array, including `null` and an array-like object     | throws `TypeError` |
