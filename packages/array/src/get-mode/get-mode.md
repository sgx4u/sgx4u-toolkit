# `getMode`

Returns every item whose frequency is maximal, in first-seen order. When every item appears once, every item is a mode.

Keys use SameValueZero. When `by` is set, frequency is of the key and each mode is the first item of that key. Numbers are not required.

## Import

```ts
import { getMode } from "@sgx4u/array";
```

## Signature

```ts
function getMode<Item>(params: GetModeParams<Item>): Item[] | undefined;
```

## Parameters

| Name    | Description                                                               |
| ------- | ------------------------------------------------------------------------- |
| `array` | Items to count.                                                           |
| `by`    | Optional property key or function. Omit it to count the items themselves. |

## Examples

```ts
getMode({ array: ["a", "b", "a"] }); // ["a"]
getMode({ array: ["a", "b"] }); // ["a", "b"]
getMode({ array: [] }); // undefined
```

## Edge cases

| Input                            | Result                              |
| -------------------------------- | ----------------------------------- |
| `[]`, or `array` is not an array | `undefined`                         |
| Every item appears once          | A new array of every item, in order |
| `NaN`                            | `NaN` matches `NaN`                 |
| A sparse hole                    | Counted as `undefined`              |
| `by` is not an iteratee          | Throws `TypeError`                  |

The result is a new array. The input is not mutated.
