# `getObjectSize`

Counts own enumerable keys. deep adds nested plain objects and arrays, once per node.

## Import

```ts
import { getObjectSize } from "@sgx4u/object";
```

## Signature

```ts
function getObjectSize(object) or getObjectSize({ object, deep = false, includeSymbols = false });
```

The input is not mutated. Invalid values return `false` for predicates and `undefined` for readers that cannot interpret the value. These functions do not throw.

## Example

```ts
getObjectSize({ a: { b: 1 } }); // 1
```

## Edge cases

| Value                      | Result                                                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `null`, a number, a string | Predicate returns `false`. A key list returns `undefined`.                                                  |
| An array                   | Not a plain object. `isObjectLike` returns `true`.                                                          |
| A cycle                    | `isJSONValue` returns `false`. `hasCircularReference` returns `true`. `isDeepFrozen` visits the cycle once. |
