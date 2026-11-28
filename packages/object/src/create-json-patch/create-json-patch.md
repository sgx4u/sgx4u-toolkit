# `createJSONPatch`

Builds an RFC 6902 patch that turns `first` into `second`. Equal values return `[]`. The patch uses JSON Pointer paths and only the operations `"add"`, `"remove"`, and `"replace"`.

`"move"` is not emitted. `applyJSONPatch` still accepts it. `"copy"` is not emitted either.

## Import

```ts
import { createJSONPatch } from "@sgx4u/object/json-patch";
```

## Signature

```ts
function createJSONPatch(params: CreateJSONPatchParams): JSONPatchOperation[];
```

```ts
interface CreateJSONPatchParams {
    first: unknown;
    second: unknown;
}
```

## Comparison

Arrays are compared by index. Shared indexes are patched in place. Extra indexes on `first` are removed from the end, so earlier indexes stay valid. New indexes are added after those removes. This is not a move and not a longest-common-subsequence diff: `["a", "b"]` to `["b", "a"]` is two replacements.

Plain objects are compared by own enumerable key. Key order does not matter. Nested arrays and plain objects are patched at their pointer. Any other difference is `"replace"`. When the roots differ in kind, the patch is one `"replace"` at `""`.

`NaN` equals `NaN`. `+0` equals `-0`. Dates compare by time value. A cycle that is not equal to the other value becomes one `"replace"` at `""`, because a pointer cannot name the loop. Inserted values are cloned.

## Examples

```ts
createJSONPatch({ first: { a: 1 }, second: { a: 2, b: 3 } });
// [
//   { op: "replace", path: "/a", value: 2 },
//   { op: "add", path: "/b", value: 3 },
// ]

createJSONPatch({ first: { a: 1 }, second: { a: 1 } }); // []

createJSONPatch({ first: { a: 1 }, second: [1] });
// [{ op: "replace", path: "", value: [1] }]
```

## Edge cases

| Input                                  | Result                         |
| -------------------------------------- | ------------------------------ |
| equal objects with different key order | `[]`                           |
| `["a", "b"]` to `["b"]`                | replace `/0`, then remove `/1` |
| a key `a/b`                            | the pointer token is `a~1b`    |
| two equal cycles                       | `[]`                           |
| two unequal cycles                     | one `"replace"` at `""`        |
| `params` is not a plain object         | throws `TypeError`             |
