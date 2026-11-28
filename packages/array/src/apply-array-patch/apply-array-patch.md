# `applyArrayPatch`

Applies a sequence patch and returns the next array.

`insert` appends the run's items and consumes nothing. `keep` requires the next source items to match the run under SameValueZero and copies those source items. `remove` requires the same match and skips the source items. A keep or remove that does not match returns `undefined`. Source items left over after the patch also return `undefined`.

## Import

```ts
import { applyArrayPatch } from "@sgx4u/array";
```

## Signature

```ts
function applyArrayPatch<Item>(
    params: ApplyArrayPatchParams<Item>,
): Item[] | undefined;
```

## Parameters

| Name    | Description                                                                             |
| ------- | --------------------------------------------------------------------------------------- |
| `array` | The array the patch is applied to.                                                      |
| `patch` | Runs whose `type` is `"keep"`, `"insert"`, or `"remove"` and whose `items` is an array. |

## Examples

```ts
applyArrayPatch({
    array: [1, 2],
    patch: [
        { type: "keep", items: [1] },
        { type: "insert", items: [9] },
        { type: "remove", items: [2] },
    ],
}); // [1, 9]
```

A patch from `diffArraySequence` applied to `first` equals `second` when both sides are arrays of values that SameValueZero can match.

## Edge cases

| Input                                                     | Result                 |
| --------------------------------------------------------- | ---------------------- |
| `array` is not an array                                   | `undefined`            |
| A keep or remove does not match the next source items     | `undefined`            |
| Source items remain after the patch                       | `undefined`            |
| An empty patch on an empty array                          | `[]`                   |
| `patch` is not an array                                   | Throws `TypeError`     |
| A run's `type` is not `"keep"`, `"insert"`, or `"remove"` | Throws `TypeError`     |
| A run's `items` is not an array                           | Throws `TypeError`     |
| A sparse hole                                             | Matched as `undefined` |

Success returns a new array. Neither input is mutated.
