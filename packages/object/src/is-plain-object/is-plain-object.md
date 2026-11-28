# `isPlainObject`

Reports whether a value is a plain object created by Object, Object.create(null), or another realm's Object.

## Import

```ts
import { isPlainObject } from "@sgx4u/object";
```

## Signature

```ts
function isPlainObject(value);
```

The input is not mutated. Invalid values return `false` for predicates and `undefined` for readers that cannot interpret the value. These functions do not throw.

## Example

```ts
isPlainObject({ id: 1 }); // true
```

## Edge cases

| Value                      | Result                                                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `null`, a number, a string | Predicate returns `false`. A key list returns `undefined`.                                                  |
| An array                   | Not a plain object. `isObjectLike` returns `true`.                                                          |
| A cycle                    | `isJSONValue` returns `false`. `hasCircularReference` returns `true`. `isDeepFrozen` visits the cycle once. |
