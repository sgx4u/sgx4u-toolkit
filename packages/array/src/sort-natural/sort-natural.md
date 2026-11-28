# `sortNatural`

Sorts a copy with numeric natural order. Strings use a collator with `numeric: true`, so `"item2"` comes before `"item10"` for both `en-US` and `en-IN`. Real numbers still compare as numbers. `direction` defaults to `"ascending"`. `nulls` defaults to `"last"` and does not flip when the direction is descending. The sort is stable.

A function `by` is called once per item, with the item, its original index, and the source array. Omit `by` to sort the items themselves.

## Import

```ts
import { sortNatural, type SortNaturalParams } from "@sgx4u/array";
```

## Signature

```ts
function sortNatural<Item>(params: SortNaturalParams<Item>): Item[] | undefined;
```

## Parameters

| Name        | Type                          | Default            | Description                                                |
| ----------- | ----------------------------- | ------------------ | ---------------------------------------------------------- |
| `array`     | `readonly Item[]`             |                    | Items to sort. The array is not mutated.                   |
| `by`        | `Iteratee<Item>`              | the item           | Property key or function.                                  |
| `direction` | `"ascending" \| "descending"` | `"ascending"`      | Sort direction.                                            |
| `locale`    | `string \| readonly string[]` | the runtime locale | BCP 47 tag or list. Pass it explicitly for a stable order. |
| `nulls`     | `"first" \| "last"`           | `"last"`           | Where `null`, `undefined`, and `NaN` go.                   |

## Examples

```ts
sortNatural({ array: ["item10", "item2", "item1"], locale: "en-US" });
// ["item1", "item2", "item10"]
```

## Edge cases

- A non-object, including `{}`, a `Uint8Array`, a `Set`, and a generator, returns `undefined`.
- A non-array `array` returns `undefined` when `by`, `direction`, `locale`, and `nulls` are valid.
- An unknown `direction` or `nulls` throws `RangeError`. An invalid `by` throws `TypeError`. Both are checked before `array`.
- Holes are `undefined` and follow `nulls`. The result is a new array.
