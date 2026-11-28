# `cloneDeepWith`

Deep-copies `value` by calling `cloneDeepValue`, and asks `customizer` before the default clone of each node. Return `cloneContinue` to keep the default clone. Return `undefined` to store `undefined`. `undefined` does not mean continue. Any other return value is stored as-is and is not cloned further.

`cloneContinue` is a unique symbol. Dangerous keys are skipped. The input is left unchanged. A cycle with `circular: "throw"` raises `RangeError` from `cloneDeepValue`.

## Import

```ts
import { cloneContinue, cloneDeepWith } from "@sgx4u/object";
```

## Signature

```ts
function cloneDeepWith(params: CloneDeepWithParams): unknown;

const cloneContinue: unique symbol;
```

## Options

| Option       | Default      | Meaning                                            |
| ------------ | ------------ | -------------------------------------------------- |
| `value`      |              | The value to copy.                                 |
| `customizer` |              | `(details: CloneVisit) => unknown`. Required.      |
| `circular`   | `"preserve"` | `"preserve"`, `"skip"`, `"throw"`, or `"replace"`. |
| `prototypes` | `"strip"`    | `"strip"` or `"keep"`.                             |

A `customizer` that is not a function throws `TypeError`. Unknown `circular` or `prototypes` throws `RangeError`.

## Example

```ts
cloneDeepWith({
    value: { n: 1 },
    customizer: ({ value }) => (value === 1 ? 2 : cloneContinue),
});
// { n: 2 }
```

## Edge cases

| Customizer result                    | Stored value                        |
| ------------------------------------ | ----------------------------------- |
| `cloneContinue`                      | The default deep clone              |
| `undefined`                          | `undefined`                         |
| Any other value                      | That value, with no further cloning |
| Missing or non-function `customizer` | `TypeError`                         |
| `circular: "throw"` and a cycle      | `RangeError`                        |
