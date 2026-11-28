# `findKey`

Returns the first own enumerable string key whose predicate is truthy. Keys are tested in insertion order.

## Import

```ts
import { findKey } from "@sgx4u/object";
```

## Signature

```ts
function findKey(params: FindKeyParams): string | undefined;
```

`predicate` is called as `predicate(value, key, object)`.

## Behavior

Only a plain object is searched. Arrays, class instances, `null`, and primitives return `undefined`. An own `__proto__`, `prototype`, or `constructor` key is read with its own value.

## Examples

```ts
findKey({
    object: { id: 1, name: "Ada" },
    predicate: (value) => value === "Ada",
}); // "name"
```

## Edge cases

| Call                             | Result      |
| -------------------------------- | ----------- |
| No truthy predicate result       | `undefined` |
| Array, `null`, or class instance | `undefined` |
| `predicate` is not a function    | `TypeError` |
