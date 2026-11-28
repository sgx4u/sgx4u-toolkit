# `zip`

Builds tuples from the items that share an index. The inputs are not mutated.

`"longest"` is the default and fills a missing entry with `fillValue` (`undefined` when omitted). `"shortest"` stops at the shortest array. `"strict"` throws when the lengths differ.

## Import

```ts
import { zip } from "@sgx4u/array";
```

## Signature

```ts
function zip<Item>(params: ZipParams<Item>): (Item | undefined)[][] | undefined;
```

## Parameters

| Name        | Type                                  | Default     | Description                                         |
| ----------- | ------------------------------------- | ----------- | --------------------------------------------------- |
| `arrays`    | `readonly (readonly Item[])[]`        |             | Arrays to combine. Every slot must be an array.     |
| `mode`      | `"longest" \| "shortest" \| "strict"` | `"longest"` | How many tuples to build.                           |
| `fillValue` | `Item`                                | `undefined` | Value used for a missing entry in `"longest"` mode. |

## Examples

```ts
zip({ arrays: [[1, 2], [3]] }); // [[1, 3], [2, undefined]]
zip({ arrays: [[1, 2], [3]], fillValue: 0 }); // [[1, 3], [2, 0]]
zip({
    arrays: [
        [1, 2, 3],
        [4, 5],
    ],
    mode: "shortest",
}); // [[1, 4], [2, 5]]
zip({ arrays: [] }); // []
```

## Edge cases

- `null`, a string, or another non-object returns `undefined`.
- An empty list returns `[]`.
- A slot that is not an array, including `{}`, a typed array, a `Set`, or a generator, returns `undefined`.
- An unknown `mode` throws `RangeError` before the list is read.
- `"strict"` with different lengths throws `RangeError`. The message lists the lengths, for example `received 1,2.`
- A hole is read as `undefined`.
- Each tuple is a new array. The inputs are not mutated.
