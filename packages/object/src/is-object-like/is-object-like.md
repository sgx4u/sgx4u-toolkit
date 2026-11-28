# `isObjectLike`

Reports whether a value is a non-null object. Arrays and dates qualify. Functions do not.

## Import

```ts
import { isObjectLike } from "@sgx4u/object";
```

## Signature

```ts
function isObjectLike(value);
```

The input is not mutated. Invalid values return `false` for predicates and `undefined` for readers that cannot interpret the value. These functions do not throw.

## Example

```ts
isObjectLike([]); // true
```

## Edge cases

| Value                      | Result                                                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `null`, a number, a string | Predicate returns `false`. A key list returns `undefined`.                                                  |
| An array                   | Not a plain object. `isObjectLike` returns `true`.                                                          |
| A cycle                    | `isJSONValue` returns `false`. `hasCircularReference` returns `true`. `isDeepFrozen` visits the cycle once. |
