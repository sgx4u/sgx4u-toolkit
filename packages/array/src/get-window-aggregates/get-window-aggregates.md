# `getWindowAggregates`

Returns a value for each sliding window. Each result is `{ start, end, items, value }`. `end` is exclusive (`start + items.length`). `items` is a new array.

Named aggregates are `"sum"`, `"mean"`, `"min"`, and `"max"`. They require finite numbers. A function receives the window items as they are.

`partial` defaults to `true`, so a short window at the end is kept. `false` drops a window shorter than `size`.

## Import

```ts
import { getWindowAggregates } from "@sgx4u/array";
```

## Signature

```ts
function getWindowAggregates<Item, Result>(
    params: GetWindowAggregatesParams<Item, Result>,
): WindowAggregate<Item, Result>[] | undefined;
```

## Parameters

| Name        | Description                                                  |
| ----------- | ------------------------------------------------------------ |
| `array`     | Items to window.                                             |
| `size`      | Maximum items in one window. A positive integer.             |
| `step`      | Distance between window starts. Defaults to `1`.             |
| `aggregate` | `"sum"`, `"mean"`, `"min"`, `"max"`, or `(items) => result`. |
| `partial`   | Keep a short trailing window. Defaults to `true`.            |

## Examples

```ts
getWindowAggregates({
    array: [1, 2, 3, 4],
    size: 2,
    step: 2,
    aggregate: "sum",
});
// [
//   { start: 0, end: 2, items: [1, 2], value: 3 },
//   { start: 2, end: 4, items: [3, 4], value: 7 },
// ]
```

## Edge cases

| Input                                             | Result                             |
| ------------------------------------------------- | ---------------------------------- |
| `[]`                                              | `undefined`                        |
| `array` is not an array                           | `undefined`                        |
| Non-empty, `partial: false`, and `length < size`  | `[]`                               |
| `size` or `step` is not a positive integer        | Throws `TypeError` or `RangeError` |
| `aggregate` is not a supported name or a function | Throws `RangeError`                |
| A named aggregate sees a non-finite item          | Throws `TypeError`                 |
| `partial` is not a boolean                        | Throws `TypeError`                 |

An empty array does not produce a window of nothing. The input is not mutated.
