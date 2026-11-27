# `getObjectValues`

Lists values for the same keys as getObjectKeys. The input is not mutated.

## Import

```ts
import { getObjectValues } from "@sgx4u/object";
```

## Signature

```ts
function getObjectValues(object) or getObjectValues({ object, includeSymbols, includeNonEnumerable });
```

The input is not mutated. Invalid values return `false` for predicates and `undefined` for readers that cannot interpret the value. These functions do not throw.

## Example

```ts
getObjectValues({ id: 1 }); // [1]
```

## Edge cases

| Value                      | Result                                                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `null`, a number, a string | Predicate returns `false`. A key list returns `undefined`.                                                  |
| An array                   | Not a plain object. `isObjectLike` returns `true`.                                                          |
| A cycle                    | `isJSONValue` returns `false`. `hasCircularReference` returns `true`. `isDeepFrozen` visits the cycle once. |
