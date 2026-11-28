# `getBestItem`

Returns the item that wins a left-to-right comparison. The first item is the champion. Each later item replaces it when `isBetter(candidate, champion)` is true.

## Import

```ts
import { getBestItem } from "@sgx4u/array";
```

## Signature

```ts
function getBestItem<Item>(params: GetBestItemParams<Item>): Item | undefined;
```

## Parameters

| Name       | Description                                  |
| ---------- | -------------------------------------------- |
| `array`    | Items to compare.                            |
| `isBetter` | Function `(candidate, champion) => boolean`. |

## Examples

```ts
getBestItem({
    array: ["aa", "b", "ccc"],
    isBetter: (candidate, champion) => candidate.length > champion.length,
}); // "ccc"

getBestItem({ array: [], isBetter: () => true }); // undefined
```

## Edge cases

| Input                            | Result             |
| -------------------------------- | ------------------ |
| `[]`, or `array` is not an array | `undefined`        |
| `isBetter` always returns false  | The first item     |
| `isBetter` is not a function     | Throws `TypeError` |

The input array is not mutated.
