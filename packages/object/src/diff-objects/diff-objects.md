# `diffObjects`

Builds a structural `ObjectDiff` from one value to another. The result is always a diff. The inputs are not mutated.

## Import

```ts
import { diffObjects } from "@sgx4u/object";
```

## Signature

```ts
function diffObjects(params: DiffObjectsParams): ObjectDiff;
```

## Behavior

Equal values, compared with `valuesAreEqual`, are `{ kind: "unchanged" }`. `NaN` equals `NaN`.

Plain objects produce `{ kind: "object", properties }` and omit unchanged keys. A key only on the left is `"removed"`. A key only on the right is `"added"`. A key on both sides is diffed again.

Arrays are compared by index. A longer right-hand tail is `"added"`. A longer left-hand tail is `"removed"`. Only indexes that differ are listed.

An object compared with an array, or either compared with a primitive, is `{ kind: "changed", from, to }`. Two different primitives use that same kind.

Symbol keys are ignored unless `includeSymbols` is true. A symbol difference is reported as `"changed"` for the whole object, because property diffs can only name string keys. A cycle stops instead of looping; the back edge is treated as unchanged.

## Examples

```ts
diffObjects({ first: { id: 1 }, second: { id: 2 } });
// { kind: "object", properties: { id: { kind: "changed", from: 1, to: 2 } } }

diffObjects({ first: [1, 2, 3], second: [1, 9, 3, 4] });
// index 1 changed, index 3 added
```

## Edge cases

| Pair                                 | Result                          |
| ------------------------------------ | ------------------------------- |
| Deep-equal values                    | `{ kind: "unchanged" }`         |
| Shorter right-hand array             | `"removed"` items for the tail  |
| Longer right-hand array              | `"added"` items for the tail    |
| Object versus array                  | `{ kind: "changed", from, to }` |
| Symbol keys, `includeSymbols: false` | Ignored                         |
| Cycle                                | The back edge does not recurse  |
