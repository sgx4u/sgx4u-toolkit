# `sortBy`

Sorts a copy of `array` by one or more keys. The sort is stable: equal keys keep their input order. Later keys break ties. A key's direction, locale, numeric mode, sensitivity, and null placement override the call-level defaults.

`null`, `undefined`, and `NaN` use `nulls`, which defaults to `"last"`. That placement does not flip when the direction is descending. An empty `keys` list returns a shallow copy. Each key function is called once, with the item, its original index, and the source array.

## Import

```ts
import { sortBy, type SortByParams } from "@sgx4u/array";
```

## Signature

```ts
function sortBy<Item>(params: SortByParams<Item>): Item[] | undefined;
```

## Parameters

| Name          | Type                                        | Default            | Description                                                                            |
| ------------- | ------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------- |
| `array`       | `readonly Item[]`                           |                    | Items to sort. The array is not mutated.                                               |
| `keys`        | `readonly SortKey<Item>[]`                  |                    | Keys from left to right. An empty list keeps the original order.                       |
| `direction`   | `"ascending" \| "descending"`               | `"ascending"`      | Default direction. A key can override it.                                              |
| `locale`      | `string \| readonly string[]`               | the runtime locale | BCP 47 tag or list. Pass it explicitly when the order must not follow the host locale. |
| `numeric`     | `boolean`                                   | `false`            | When `true`, `"item2"` sorts before `"item10"`.                                        |
| `sensitivity` | `"base" \| "accent" \| "case" \| "variant"` | `"variant"`        | Collator sensitivity.                                                                  |
| `nulls`       | `"first" \| "last"`                         | `"last"`           | Where nullish keys and `NaN` go.                                                       |

## Examples

```ts
sortBy({
    array: ["item10", "item2"],
    keys: [(item) => item],
    numeric: true,
    locale: "en-US",
});
// ["item2", "item10"]
```

## Edge cases

- A non-object returns `undefined`. A non-array `array` returns `undefined` when `keys` and the options are valid.
- `keys` must be an array. A bad `keys` value throws `TypeError` even when `array` is also invalid.
- An unknown `direction`, `sensitivity`, or `nulls` throws `RangeError`. A non-boolean `numeric` throws `TypeError`. An invalid locale throws `RangeError`.
- Holes are read as `undefined` and follow `nulls`. The result is a new array.
