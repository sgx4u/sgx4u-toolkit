# `xnor`

True when an even number of entries are `true`. A non-boolean entry returns `undefined`. The array is read and left unchanged. `true` for `[]`. For two values this is also equivalence. For three or more it is parity, not "all equal". [`areEqual`](../are-equal/are-equal.md) answers that question. `xnor([true, true, true])` is `false`.

## Import

```ts
import { xnor } from "@sgx4u/boolean";
```

## Signature

```ts
function xnor(values: readonly unknown[]): boolean | undefined;
```

## Examples

```ts
xnor([]); // true
xnor([true, false]);
```

## Edge cases

| Call                                                       | Result             |
| ---------------------------------------------------------- | ------------------ |
| `[]`                                                       | `true`             |
| An entry that is not a primitive boolean, including a hole | `undefined`        |
| `new Boolean(true)` inside the list                        | `undefined`        |
| A non-array, including `null` and an array-like object     | throws `TypeError` |
