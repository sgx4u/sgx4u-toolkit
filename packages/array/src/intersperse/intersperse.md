# `intersperse`

Inserts a separator between items and returns a new array. The input is not mutated. An empty array or a one-item array is copied without the separator.

## Import

```ts
import { intersperse } from "@sgx4u/array";
```

## Signature

```ts
function intersperse<Item, Separator = Item>(
    params: IntersperseParams<Item, Separator>,
): (Item | Separator)[] | undefined;
```

## Parameters

| Name        | Type              | Description                 |
| ----------- | ----------------- | --------------------------- |
| `array`     | `readonly Item[]` | Source array.               |
| `separator` | `Separator`       | Value placed between items. |

## Examples

```ts
intersperse({ array: [1, 2, 3], separator: 0 }); // [1, 0, 2, 0, 3]
intersperse({ array: [1, 2], separator: "and" }); // [1, "and", 2]
intersperse({ array: [1], separator: 0 }); // [1]
intersperse({ array: [], separator: 0 }); // []
```

## Edge cases

- `null`, `{}`, a string, a typed array, a `Set`, or a generator returns `undefined`.
- Zero or one item returns a shallow copy. The separator is not added.
- The separator keeps its reference. Source items keep theirs.
- A frozen array is not mutated. The result is a new array.
- A hole becomes `undefined`, and separators are still placed around it.
