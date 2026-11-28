# `fromObjectEntries`

Builds an object from pairs. Dangerous keys are skipped. A non-iterable returns undefined.

## Import

```ts
import { fromObjectEntries } from "@sgx4u/object";
```

## Signature

```ts
function fromObjectEntries(entries);
```

The input is not mutated. Invalid values return `false` for predicates and `undefined` for readers that cannot interpret the value. These functions do not throw.

## Example

```ts
fromObjectEntries([["id", 1]]); // { id: 1 }
```

## Edge cases

| Value                      | Result                                                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `null`, a number, a string | Predicate returns `false`. A key list returns `undefined`.                                                  |
| An array                   | Not a plain object. `isObjectLike` returns `true`.                                                          |
| A cycle                    | `isJSONValue` returns `false`. `hasCircularReference` returns `true`. `isDeepFrozen` visits the cycle once. |
