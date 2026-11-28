# `findLastKey`

Returns the last own enumerable string key whose predicate is truthy. Keys are tested from the end of the insertion order.

## Import

```ts
import { findLastKey } from "@sgx4u/object";
```

## Signature

```ts
function findLastKey(params: FindLastKeyParams): string | undefined;
```

`predicate` is called as `predicate(value, key, object)`.

## Behavior

The rules match `findKey`, except the last match wins. A value that is not a plain object returns `undefined`.

## Examples

```ts
findLastKey({
    object: { a: 1, b: 1, c: 2 },
    predicate: (value) => value === 1,
}); // "b"
```

## Edge cases

| Call                                    | Result      |
| --------------------------------------- | ----------- |
| One match                               | That key    |
| No match                                | `undefined` |
| Array, `null`, or other non-plain value | `undefined` |
| `predicate` is not a function           | `TypeError` |
