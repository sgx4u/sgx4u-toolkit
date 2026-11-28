# `joinItems`

Joins formatted items into one string. The input array is not mutated.

`separator` defaults to `", "`. `format` defaults to `String`. Two items use `lastSeparator` when it is set, otherwise `separator`. Three or more items use `separator` between every pair except the last, then `lastSeparator` (or `separator`) before the last.

## Import

```ts
import { joinItems } from "@sgx4u/array";
```

## Signature

```ts
function joinItems<Item>(params: JoinItemsParams<Item>): string | undefined;
```

## Parameters

| Name            | Type                      | Default     | Description                                                              |
| --------------- | ------------------------- | ----------- | ------------------------------------------------------------------------ |
| `array`         | `readonly Item[]`         |             | Items to format and join.                                                |
| `separator`     | `string`                  | `", "`      | Text between items, except before the last when `lastSeparator` is set.  |
| `lastSeparator` | `string`                  | `separator` | Text before the last item. Two items use only this value when it is set. |
| `format`        | `(item, index) => string` | `String`    | Formats one item.                                                        |

## Examples

```ts
joinItems({ array: ["A", "B", "C"], lastSeparator: ", and " }); // "A, B, and C"
joinItems({ array: ["A", "B"], lastSeparator: " and " }); // "A and B"
joinItems({ array: ["A"] }); // "A"
joinItems({ array: [] }); // ""
```

## Edge cases

- `null`, a string, or another non-object returns `undefined`.
- A non-array `array` returns `undefined`. That includes `{}`, a typed array, a `Set`, and a generator.
- Zero items returns `""`. One item returns the formatted item with no separator.
- A present `format` that is not a function throws `TypeError` before `array` is read.
- A hole is formatted with `String`, which produces `"undefined"`.
- The input array is not mutated.
