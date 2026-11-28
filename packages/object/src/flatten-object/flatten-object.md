# `flattenObject`

Copies the leaf values of a plain object or array into one record. Keys are joined with `delimiter`, which defaults to `"."`.

## Import

```ts
import { flattenObject, type FlattenObjectParams } from "@sgx4u/object";
```

## Signature

```ts
function flattenObject(
    params: FlattenObjectParams,
): Record<string, unknown> | undefined;
```

`arrays` defaults to `"index"`, so array elements use their index as a segment. `"keep"` stores the array as one value. `maxDepth` defaults to `Infinity` and counts edges. When the next edge would pass `maxDepth`, the current value is stored at the current prefix. `maxDepth: 0` with an empty prefix stores the root at `""`. A non-empty `prefix` is joined with the same delimiter.

An empty plain object or empty array at the root returns `{}` because it has no edges. A nested empty object or empty array is stored as a value.

## Circular references

The default `"skip"` omits the edge that points at an ancestor. `"throw"` raises `RangeError`. `"preserve"` and `"replace"` also omit that edge: a flat record cannot point back at an ancestor. A value stored whole because of `maxDepth`, or because `arrays` is `"keep"`, keeps the original reference, so a cycle inside that value stays inside it.

## Examples

```ts
flattenObject({ object: { user: { name: "Ada" } } });
// { "user.name": "Ada" }

flattenObject({ object: { a: [10, { b: 20 }] } });
// { "a.0": 10, "a.1.b": 20 }

flattenObject({ object: { a: {} } });
// { a: {} }
```

## Edge cases

A result key of `"__proto__"`, `"prototype"`, or `"constructor"` is skipped. A longer key such as `"__proto__.polluted"` is an ordinary string. `null` and primitives return `undefined`. Unknown `arrays` or `circular`, an empty `delimiter`, a negative `maxDepth`, and a non-string `prefix` throw `RangeError`. The input is not mutated.
