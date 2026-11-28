# `binItems`

Builds a numeric histogram. Provide exactly one of `binCount` and `binWidth`.

`start` defaults to the minimum value and `end` defaults to the maximum. Every bin except the last is half-open: `start <= value < end`. The last bin is closed on the right. Values outside `[start, end]` are excluded.

When the span is 0 and `binCount` is set, the width is 1, so every value falls in the first bin and the extra bins follow. When `binWidth` is set, the number of bins is 1 when the span is 0 and otherwise `Math.ceil(span / binWidth)`. A `binWidth` histogram may extend the last bin past `end` so every bin has that width; values greater than `end` are still excluded.

## Import

```ts
import { binItems } from "@sgx4u/array";
```

## Signature

```ts
function binItems<Item>(
    params: BinItemsParams<Item>,
): HistogramBin<Item>[] | undefined;
```

`HistogramBin` is `{ start, end, count, items }`.

## Parameters

| Name       | Description                                                       |
| ---------- | ----------------------------------------------------------------- |
| `array`    | Values to bin.                                                    |
| `by`       | Optional property key or function that returns a finite number.   |
| `binCount` | Positive integer. Do not set this together with `binWidth`.       |
| `binWidth` | Positive finite number. Do not set this together with `binCount`. |
| `start`    | Left edge. Defaults to the minimum value.                         |
| `end`      | Right edge. Defaults to the maximum value.                        |

## Examples

```ts
binItems({ array: [1, 2, 3, 4, 5], binCount: 2 });
// [
//   { start: 1, end: 3, count: 2, items: [1, 2] },
//   { start: 3, end: 5, count: 3, items: [3, 4, 5] },
// ]

binItems({ array: [5, 5], binCount: 2 });
// first bin [5, 6) holds both values; the next bin is empty
```

## Edge cases

| Input                                         | Result                             |
| --------------------------------------------- | ---------------------------------- |
| `[]`, or `array` is not an array              | `undefined`                        |
| Both `binCount` and `binWidth`, or neither    | Throws `RangeError`                |
| `binCount` is not a positive integer          | Throws `TypeError` or `RangeError` |
| `binWidth` is not a positive finite number    | Throws `TypeError` or `RangeError` |
| `start` or `end` is not finite                | Throws `TypeError` or `RangeError` |
| `end` is less than `start`                    | Throws `RangeError`                |
| An item or `by` result is not a finite number | Throws `TypeError`                 |
| A value outside `[start, end]`                | Excluded                           |
| The computed bin count is not a safe integer  | Throws `RangeError`                |

Each bin's `items` is a new array. The input is not mutated.
