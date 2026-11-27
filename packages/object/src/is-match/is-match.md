# `isMatch`

Reports whether `object` has at least the structure and values in `specification`. Extra keys on `object` are allowed. The function does not throw.

Nested plain objects recurse, so a nested specification can be a partial object. Arrays match by index and the object array may be longer. A hole in the specification adds no constraint. A specification that is not a plain object or an array uses deep equality, so `NaN` matches `NaN` and invalid dates match. `null` matches only `null`.

An empty plain specification matches every value. A missing key matches a specification value of `undefined`. A cyclic specification ends when that same specification object is seen again.

## Import

```ts
import { isMatch } from "@sgx4u/object";
```

## Signature

```ts
function isMatch(params: IsMatchParams): boolean;
```

## Options

`object` is the value being tested. `specification` is the required structure.

## Example

```ts
isMatch({ object: { a: 1, b: 2 }, specification: { b: 2 } });
// true

isMatch({ object: [1, 2, 3], specification: [1, 2] });
// true
```

## Edge cases

| Specification                               | Result                                                                         |
| ------------------------------------------- | ------------------------------------------------------------------------------ |
| Plain object                                | Every own enumerable string key must match. Extra keys on `object` are allowed |
| Array                                       | Matched by index. A shorter object array fails                                 |
| `null`                                      | `true` only when `object` is `null`                                            |
| Primitive, `Date`, `Map`, or class instance | Deep equality                                                                  |
| `{}`                                        | `true` for every `object`, including `null` and primitives                     |
| Argument is not an object                   | `false`                                                                        |
