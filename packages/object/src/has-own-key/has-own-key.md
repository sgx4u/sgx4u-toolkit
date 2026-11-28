# `hasOwnKey`

Reports whether an object has an own key. null returns false.

## Import

```ts
import { hasOwnKey } from "@sgx4u/object";
```

## Signature

```ts
function hasOwnKey({ object, key });
```

The input is not mutated. Invalid values return `false` for predicates and `undefined` for readers that cannot interpret the value. These functions do not throw.

## Example

```ts
hasOwnKey({ object: { id: 1 }, key: "id" }); // true
```

## Edge cases

| Value                      | Result                                                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `null`, a number, a string | Predicate returns `false`. A key list returns `undefined`.                                                  |
| An array                   | Not a plain object. `isObjectLike` returns `true`.                                                          |
| A cycle                    | `isJSONValue` returns `false`. `hasCircularReference` returns `true`. `isDeepFrozen` visits the cycle once. |
