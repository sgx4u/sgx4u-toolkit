# `all`

True when every entry is `true`. A non-boolean entry returns `undefined`. The array is read and left unchanged. `true` for `[]`. This matches `Array#every`.

## Import

```ts
import { all } from "@sgx4u/boolean";
```

## Signature

```ts
function all(values: readonly unknown[]): boolean | undefined;
```

## Examples

```ts
all([]); // true
all([true, false]);
```

## Edge cases

| Call                                                       | Result             |
| ---------------------------------------------------------- | ------------------ |
| `[]`                                                       | `true`             |
| An entry that is not a primitive boolean, including a hole | `undefined`        |
| `new Boolean(true)` inside the list                        | `undefined`        |
| A non-array, including `null` and an array-like object     | throws `TypeError` |
