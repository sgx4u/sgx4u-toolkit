# `flattenTree`

Walks a forest in depth-first pre-order and returns the nodes. Each node is emitted before its children. The input is not mutated.

`getChildren` wins over `childrenKey` when it is provided. `childrenKey` defaults to `"children"`. Missing children, or children that are not an array, make the node a leaf.

## Import

```ts
import { flattenTree } from "@sgx4u/array";
```

## Signature

```ts
function flattenTree<Item>(params: FlattenTreeParams<Item>): Item[] | undefined;
```

## Parameters

| Name          | Type                | Default      | Description                                                 |
| ------------- | ------------------- | ------------ | ----------------------------------------------------------- |
| `array`       | `readonly Item[]`   |              | Roots of the forest.                                        |
| `childrenKey` | `string`            | `"children"` | Property that holds children when `getChildren` is omitted. |
| `getChildren` | `(node) => unknown` |              | Reads children. A non-array result is a leaf.               |

## Examples

```ts
flattenTree({
    array: [{ id: "a", children: [{ id: "b", children: [{ id: "c" }] }] }],
});
// nodes a, b, c

flattenTree({
    array: [
        { id: "root", children: [{ id: "ignored" }], kids: [{ id: "kept" }] },
    ],
    getChildren: (node) => node.kids,
});
// nodes root, kept
```

## Edge cases

- `null`, a string, or another non-object returns `undefined`.
- A non-array `array` returns `undefined`. That includes `{}`, a typed array, a `Set`, and a generator.
- An empty forest returns a new `[]`.
- A cycle is skipped: if an object node is already on the current path, that visit is not emitted and its children are not walked. The walk does not throw.
- Only object nodes are tracked. `null` is not tracked. The same child can appear twice when it is not an ancestor of itself.
- A present `getChildren` that is not a function throws `TypeError` before `array` is read.
- A hole in the forest is emitted as `undefined`.
- The input is not mutated.
