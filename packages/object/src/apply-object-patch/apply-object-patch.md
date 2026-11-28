# `applyObjectPatch`

Applies an `ObjectDiff` without mutating the input.

## Import

```ts
import { applyObjectPatch } from "@sgx4u/object";
```

## Signature

```ts
function applyObjectPatch(params: ApplyObjectPatchParams): unknown;
```

## Behavior

An invalid patch returns `undefined`. The `kind` discriminators are checked recursively. A cycle in the patch is invalid.

`"unchanged"` returns the same reference. `"added"` and `"changed"` at the root return the new value. `"removed"` at the root returns `undefined`.

An object diff copies the object, including a null prototype, and then applies each property. Added and changed properties are set. Removed properties are deleted. Nested object and array diffs recurse. Unchanged subtrees keep their references.

An array diff rebuilds by the original index. A removed index is omitted and later items shift up. An added index inserts the new value and, when that index already exists, keeps the original element after it. Other indexes are kept or replaced from their diff.

`undefined` means either the patch removed the root or the patch was invalid.

## Examples

```ts
applyObjectPatch({
    object: { id: 1 },
    patch: {
        kind: "object",
        properties: { id: { from: 1, kind: "changed", to: 2 } },
    },
}); // { id: 2 }
```

`applyObjectPatch({ object: first, patch: diffObjects({ first, second }) })` deep-equals `second` for nested objects and for arrays whose diff is an index change plus a tail insertion or deletion.

## Edge cases

| Patch                                          | Result                                   |
| ---------------------------------------------- | ---------------------------------------- |
| `{ kind: "unchanged" }`                        | The same reference                       |
| Root `"removed"`                               | `undefined`                              |
| Unknown `kind`, bad index, or incomplete field | `undefined`                              |
| Added index on an existing array slot          | The new value, then the original element |
| Removed index                                  | That element is omitted                  |
