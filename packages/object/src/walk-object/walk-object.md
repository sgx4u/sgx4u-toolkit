# `walkObject`

Walks a value depth-first and calls a visitor for each node. Cycles are not visited again. The input is not mutated.

## Import

```ts
import { walkObject } from "@sgx4u/object";
```

## Signature

```ts
function walkObject(params: WalkObjectParams): void;
```

`visitor` receives `{ value, key?, path, parent?, skip }`. `key` and `parent` are omitted at the root. `path` is empty there. `skip()` drops the children of the current node and does not affect siblings. Call it before the visitor returns.

## Behavior

The root is level 0. Children come from `forEachChild`: array elements, own enumerable string keys, map entries, set values, and an error `cause`. A primitive, `null`, or function is still visited once.

`leafOnly` visits a value only when that walk would enter no children. An array is a leaf when `includeArrays` is false. `maxDepth` does not turn a parent into a leaf. `maxDepth: 0` visits only the root. A negative `maxDepth` visits nothing.

A value that points at an ancestor is skipped. A shared reference that is not an ancestor is visited again.

## Examples

```ts
walkObject({
    object: { user: { id: 1 } },
    visitor: ({ path, value }) => {
        path; // ["user", "id"] when value is 1
        value;
    },
});

walkObject({
    includeArrays: false,
    object: { items: [1, 2] },
    visitor: ({ value }) => {
        value; // the object, then the array
    },
});
```

## Edge cases

| Call                                | Result                                                 |
| ----------------------------------- | ------------------------------------------------------ |
| Primitive, `null`, or function root | Visited once with `path: []`                           |
| `skip()` on a node                  | Its children are not visited                           |
| Value that points at an ancestor    | Not visited again                                      |
| `includeArrays: false`              | The array is visited; its elements are not             |
| `leafOnly: true`                    | Only values with no children to enter                  |
| `maxDepth: 0`                       | Only the root, unless `leafOnly` hides a non-leaf root |
| `visitor` is not a function         | `TypeError`                                            |
