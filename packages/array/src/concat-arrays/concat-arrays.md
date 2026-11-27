# `concatArrays`

Concatenates arrays and returns a new array. The inputs are not mutated.

`skipEmpty` defaults to false. `true` ignores arrays whose length is `0`. Empty arrays add no items either way. The flag still skips them instead of walking them.

## Import

```ts
import { concatArrays } from "@sgx4u/array";
```

## Signature

```ts
function concatArrays<Item>(
    params: ConcatArraysParams<Item>,
): Item[] | undefined;
```

## Parameters

| Name        | Type                           | Default | Description                                         |
| ----------- | ------------------------------ | ------- | --------------------------------------------------- |
| `arrays`    | `readonly (readonly Item[])[]` |         | Arrays to concatenate. Every slot must be an array. |
| `skipEmpty` | `boolean`                      | `false` | Ignore arrays whose length is `0`.                  |

## Examples

```ts
concatArrays({ arrays: [[1], [2, 3]] }); // [1, 2, 3]
concatArrays({ arrays: [[1], [], [2]], skipEmpty: true }); // [1, 2]
concatArrays({ arrays: [] }); // []
```

## Edge cases

- `null`, a string, or another non-object returns `undefined`.
- An empty list returns `[]`.
- A slot that is not an array, including `{}`, a typed array, a `Set`, or a generator, returns `undefined`.
- A hole becomes `undefined`.
- Item references are preserved. The inputs are not mutated.
