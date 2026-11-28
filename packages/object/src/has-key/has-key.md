# `hasKey`

Reports whether an object has a key. Inherited keys count only when inherited is true.

## Import

```ts
import { hasKey } from "@sgx4u/object";
```

## Signature

```ts
function hasKey({ object, key, inherited = false });
```

The input is not mutated. Invalid values return `false` for predicates and `undefined` for readers that cannot interpret the value. These functions do not throw.

## Example

```ts
hasKey({ object: {}, key: "toString", inherited: true }); // true
```

## Edge cases

| Value                      | Result                                                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `null`, a number, a string | Predicate returns `false`. A key list returns `undefined`.                                                  |
| An array                   | Not a plain object. `isObjectLike` returns `true`.                                                          |
| A cycle                    | `isJSONValue` returns `false`. `hasCircularReference` returns `true`. `isDeepFrozen` visits the cycle once. |
