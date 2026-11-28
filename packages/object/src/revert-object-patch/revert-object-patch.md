# `revertObjectPatch`

Undoes an `ObjectDiff` without mutating the input.

## Import

```ts
import { revertObjectPatch } from "@sgx4u/object";
```

## Signature

```ts
function revertObjectPatch(params: RevertObjectPatchParams): unknown;
```

## Behavior

The patch is inverted, then applied. Added becomes removed, removed becomes added, and changed swaps `from` with `to`. Nested object and array diffs are inverted the same way. An invalid patch returns `undefined`.

`revertObjectPatch({ object: second, patch: diffObjects({ first, second }) })` deep-equals `first` for the same nested objects and index-aligned arrays that `applyObjectPatch` round-trips.

## Examples

```ts
revertObjectPatch({
    object: { id: 2 },
    patch: {
        kind: "object",
        properties: { id: { from: 1, kind: "changed", to: 2 } },
    },
}); // { id: 1 }
```

## Edge cases

| Patch                       | Result                       |
| --------------------------- | ---------------------------- |
| Invalid patch               | `undefined`                  |
| Inverse removes the root    | `undefined`                  |
| Nested object or array diff | Each nested diff is inverted |
