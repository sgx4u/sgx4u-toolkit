# `isWeakMap`

Reports whether a value is a WeakMap, including one from another realm.

## Import

```ts
import { isWeakMap } from "@sgx4u/object";
```

## Signature

```ts
function isWeakMap(value);
```

The input is not mutated. Invalid values return `false` for predicates and `undefined` for readers that cannot interpret the value. These functions do not throw.

## Example

```ts
isWeakMap(new WeakMap()); // true
```

## Edge cases

| Value                      | Result                                                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `null`, a number, a string | Predicate returns `false`. A key list returns `undefined`.                                                  |
| An array                   | Not a plain object. `isObjectLike` returns `true`.                                                          |
| A cycle                    | `isJSONValue` returns `false`. `hasCircularReference` returns `true`. `isDeepFrozen` visits the cycle once. |
