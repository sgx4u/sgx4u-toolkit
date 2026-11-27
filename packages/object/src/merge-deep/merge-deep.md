# `mergeDeep`

Deep-merges object-like values from left to right by calling `mergeDeepValues`. Plain objects overlay key by key. Nested values that do not change keep their references. The inputs are left unchanged.

When `customizer` returns `undefined`, the merge keeps its default rule for that key. A returned value, including `0` or `null`, is stored as-is. The customizer runs for a key the target already has.

## Import

```ts
import { mergeDeep } from "@sgx4u/object";
```

## Signature

```ts
function mergeDeep(params: MergeDeepParams): object | undefined;
```

## Options

| Option          | Default      | Meaning                                                                 |
| --------------- | ------------ | ----------------------------------------------------------------------- |
| `objects`       |              | Sources from left to right. A non-array returns `undefined`.            |
| `arrayMerge`    | `"replace"`  | `"replace"`, `"concat"`, or `"index"`.                                  |
| `customizer`    | omitted      | `(details: MergeVisit) => unknown`. `undefined` keeps the default rule. |
| `prototypeKeys` | `"skip"`     | `"skip"`, `"throw"`, or `"keep"` for dangerous keys.                    |
| `circular`      | `"preserve"` | `"preserve"`, `"skip"`, `"throw"`, or `"replace"`.                      |

Unknown `arrayMerge`, `prototypeKeys`, or `circular` throws `RangeError`. A present `customizer` that is not a function throws `TypeError`. `circular: "throw"` throws `RangeError` when a source cycle is found; that error comes from the merge.

## Example

```ts
mergeDeep({ objects: [{ a: 1, b: { c: 1 } }, { b: { d: 2 } }] });
// { a: 1, b: { c: 1, d: 2 } }
```

## Edge cases

| Input                                           | Result                                                                                              |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Empty `objects`, or only primitives             | `{}`                                                                                                |
| `JSON.parse('{"__proto__":{"polluted":true}}')` | The key is skipped. `({}).polluted` stays falsy and `Object.prototype` gains no `polluted` property |
| `prototypeKeys: "keep"`                         | The dangerous key is an own data property                                                           |
| `customizer` returns `undefined`                | Default merge for that key                                                                          |
| A source cycle with `circular: "throw"`         | `RangeError`                                                                                        |
