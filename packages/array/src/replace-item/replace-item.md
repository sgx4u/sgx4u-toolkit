# `replaceItem`

Replaces the first value equal to `item`, or every match when `all` is true, and returns a new array. The input is not mutated.

## Import

```ts
import { replaceItem } from "@sgx4u/array";
```

## Signature

```ts
function replaceItem<Item>(params: ReplaceItemParams<Item>): Item[] | undefined;
```

## Parameters

| Name          | Type                       | Default       | Description                                          |
| ------------- | -------------------------- | ------------- | ---------------------------------------------------- |
| `array`       | `readonly Item[]`          |               | Source array.                                        |
| `item`        | `Item`                     |               | Item to find.                                        |
| `replacement` | `Item`                     |               | Value written in place of a match.                   |
| `equals`      | `(left, right) => boolean` | SameValueZero | Compares an element with `item`. `NaN` equals `NaN`. |
| `all`         | `boolean`                  | `false`       | Replace every match instead of the first.            |

## Examples

```ts
replaceItem({ array: [1, 2, 1], item: 1, replacement: 9 }); // [9, 2, 1]
replaceItem({
    array: [1, 2, 1],
    item: 1,
    replacement: 9,
    all: true,
}); // [9, 2, 9]
```

## Edge cases

- `null`, `{}`, a string, a typed array, a `Set`, or a generator returns `undefined`.
- No match, including an empty array, returns a shallow copy.
- A present `equals` that is not a function throws `TypeError`, even when `array` is invalid.
- A frozen array is not mutated. The result is a new array.
- A hole equals `undefined` under SameValueZero.
