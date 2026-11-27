# `any`

True when any entry is `true`. A non-boolean entry returns `undefined`. The array is read and left unchanged. `false` for `[]`. This matches `Array#some`.

## Import

```ts
import { any } from "@sgx4u/boolean";
```

## Signature

```ts
function any(values: readonly unknown[]): boolean | undefined;
```

## Examples

```ts
any([]); // false
any([true, false]);
```

## Edge cases

| Call                                                       | Result             |
| ---------------------------------------------------------- | ------------------ |
| `[]`                                                       | `false`            |
| An entry that is not a primitive boolean, including a hole | `undefined`        |
| `new Boolean(true)` inside the list                        | `undefined`        |
| A non-array, including `null` and an array-like object     | throws `TypeError` |
