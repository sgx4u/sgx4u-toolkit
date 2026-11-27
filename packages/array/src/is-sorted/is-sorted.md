# `isSorted`

Reports whether each item is less than or equal to the next item under the same rules as `sortBy`. An empty array and a one-item array are sorted, even when `keys` or the options would be invalid. A non-array returns `false`. When the array is longer than one item and the keys or options are invalid, the result is `false`. This function does not throw for those mistakes.

When `keys` is omitted, the items themselves are compared with the call-level direction, locale, numeric mode, sensitivity, and null placement.

## Import

```ts
import { isSorted, type IsSortedParams } from "@sgx4u/array";
```

## Signature

```ts
function isSorted<Item>(params: IsSortedParams<Item>): boolean;
```

## Parameters

| Name          | Type                                        | Default            | Description                                                            |
| ------------- | ------------------------------------------- | ------------------ | ---------------------------------------------------------------------- |
| `array`       | `readonly Item[]`                           |                    | Items to test.                                                         |
| `keys`        | `readonly SortKey<Item>[]`                  | the item           | Omit them to compare the items themselves.                             |
| `direction`   | `"ascending" \| "descending"`               | `"ascending"`      | Direction used when a key does not set one.                            |
| `locale`      | `string \| readonly string[]`               | the runtime locale | BCP 47 tag or list.                                                    |
| `numeric`     | `boolean`                                   | `false`            | When `true`, `"item2"` is before `"item10"`.                           |
| `sensitivity` | `"base" \| "accent" \| "case" \| "variant"` | `"variant"`        | Collator sensitivity.                                                  |
| `nulls`       | `"first" \| "last"`                         | `"last"`           | Where `null`, `undefined`, and `NaN` go. Direction does not flip this. |

## Examples

```ts
isSorted({ array: [1, 2, 3], locale: "en-US" });
// true
```

## Edge cases

- `null`, `{}`, a string, a `Uint8Array`, a `Set`, and a generator return `false`.
- A non-array `array` returns `false`.
- Invalid keys or options return `false` only when the array has more than one item.
- Equal neighbors are sorted. Holes are `undefined` and follow `nulls`.
- The input is not mutated. An iteratee that throws still throws.
