# `findValue`

Returns the first depth-first value whose predicate is truthy.

## Import

```ts
import { findValue } from "@sgx4u/object";
```

## Signature

```ts
function findValue(params: FindValueParams): unknown;
```

`predicate` is called as `predicate(value, path, object)`, with the same path and root as `findPath`.

## Behavior

The root is tested first. Plain objects and arrays are entered. Other objects are tested and not entered. A cycle is not entered again. A match of `undefined` is returned and the walk stops, so a later sibling is not considered.

## Examples

```ts
findValue({
    object: { user: { id: 1 } },
    predicate: (value) => value === 1,
}); // 1
```

## Edge cases

| Call                          | Result                                       |
| ----------------------------- | -------------------------------------------- |
| Root matches                  | The root                                     |
| Match is `undefined`          | `undefined`, and later nodes are not visited |
| No match                      | `undefined`                                  |
| `predicate` is not a function | `TypeError`                                  |
