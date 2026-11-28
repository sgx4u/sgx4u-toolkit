# `defaultsDeep`

Fills missing and `undefined` values at every level by calling `defaultsDeepValues`. `object` wins, including a present `null`, `0`, or `""`. Later defaults fill the remaining gaps. The inputs are left unchanged.

Input checks match `defaults`. An array `defaults` is a list of sources. Unlike shallow `defaults`, arrays stay arrays because the merge util shallow-clones the source container first.

## Import

```ts
import { defaultsDeep } from "@sgx4u/object";
```

## Signature

```ts
function defaultsDeep(params: DefaultsDeepParams): object | undefined;
```

## Options

| Option          | Default     | Meaning                                                                                                                   |
| --------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| `object`        |             | Source of truth. A non-object returns `undefined`.                                                                        |
| `defaults`      |             | One object, or a list of objects.                                                                                         |
| `arrayMerge`    | `"replace"` | `"replace"` keeps an array that is already present. `"concat"` appends. `"index"` fills holes and merges object elements. |
| `prototypeKeys` | `"skip"`    | `"skip"`, `"throw"`, or `"keep"`.                                                                                         |

Unknown `arrayMerge` or `prototypeKeys` throws `RangeError`.

## Example

```ts
defaultsDeep({
    object: { a: { b: 1 } },
    defaults: { a: { c: 2 }, d: 3 },
});
// { a: { b: 1, c: 2 }, d: 3 }
```

## Edge cases

| Input                                           | Result                                                      |
| ----------------------------------------------- | ----------------------------------------------------------- |
| Present `null`, `0`, or `""`                    | Kept, including inside nested objects                       |
| `arrayMerge: "replace"` on an array that exists | That array reference is kept. Its elements are not replaced |
| JSON `__proto__` payload                        | Skipped. `({}).polluted` stays falsy                        |
| `object` is not object-like                     | `undefined`                                                 |
| `defaults` is a primitive                       | `undefined`                                                 |
