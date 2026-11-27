# `cloneDeep`

Deep-copies a value by calling `cloneDeepValue`. Pass the value directly, or pass an options object.

An argument is read as options when it is a plain object, it owns `value`, and every own string key is one of `value`, `circular`, `prototypes`, and `prototypeKeys`. That check is `isParameterRecord`. An object whose keys are only that set is options, so the function copies `value` rather than the object itself. To copy a value with exactly those keys, give it another own key, or pass it as the `value` of an options object.

`circular: "throw"` raises `RangeError` when `cloneDeepValue` finds a cycle. The input is left unchanged.

## Import

```ts
import { cloneDeep } from "@sgx4u/object";
```

## Signature

```ts
function cloneDeep(value: unknown): unknown;
```

## Options

| Option          | Default      | Meaning                                                                               |
| --------------- | ------------ | ------------------------------------------------------------------------------------- |
| `value`         |              | The value to copy. Required on the options object.                                    |
| `circular`      | `"preserve"` | `"preserve"`, `"skip"`, `"throw"`, or `"replace"`.                                    |
| `prototypes`    | `"strip"`    | `"strip"` copies a class instance onto a plain object. `"keep"` reuses its prototype. |
| `prototypeKeys` | `"skip"`     | `"skip"`, `"throw"`, or `"keep"` for dangerous keys.                                  |

Unknown `circular`, `prototypes`, or `prototypeKeys` throws `RangeError`.

## Example

```ts
cloneDeep({ a: { b: 1 } });

cloneDeep({ value: box, circular: "preserve" });
```

## Edge cases

| Input                               | Result                                                                                   |
| ----------------------------------- | ---------------------------------------------------------------------------------------- |
| A cycle with `circular: "preserve"` | The clone points at itself. It is deep-equal to the source and is not the same reference |
| `circular: "throw"` and a cycle     | `RangeError` from `cloneDeepValue`                                                       |
| `{ value: 1 }`                      | `1`, because the object is options                                                       |
| `{ value: 1, extra: true }`         | A copy of that object, because of the extra key                                          |
| A class instance                    | Own enumerable fields on a plain object, unless `prototypes` is `"keep"`                 |
| JSON `__proto__`                    | Dropped. `({}).polluted` stays falsy                                                     |
