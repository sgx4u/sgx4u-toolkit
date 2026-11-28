# `findPath`

Returns the formatted path of the first depth-first match.

## Import

```ts
import { findPath } from "@sgx4u/object";
```

## Signature

```ts
function findPath(params: FindPathParams): string | undefined;
```

`predicate` is called as `predicate(value, path, object)`. `path` is the segment list from the root. `object` is the original value. The return value is formatted with `pathStyle`.

## Behavior

The root is tested first. Plain objects and arrays are entered. Other objects are tested and not entered. A cycle is not entered again. The empty path formats as `""`.

`pathStyle` defaults to `"dot"` (`a.b[0].c`). `"json-pointer"` uses RFC 6901 (`/a/b/0`). `pathDelimiter` defaults to `"."`.

## Examples

```ts
findPath({
    object: { items: [{ id: 1 }] },
    predicate: (value) => value === 1,
}); // "items[0].id"

findPath({
    object: { user: { id: 1 } },
    pathStyle: "json-pointer",
    predicate: (value) => value === 1,
}); // "/user/id"
```

## Edge cases

| Call                                         | Result                                            |
| -------------------------------------------- | ------------------------------------------------- |
| Root matches                                 | `""`                                              |
| No match                                     | `undefined`                                       |
| Class instance property                      | The instance is tested; its fields are not walked |
| Cycle                                        | The walk stops at the ancestor                    |
| Invalid `pathStyle` or empty `pathDelimiter` | `RangeError`                                      |
| `predicate` is not a function                | `TypeError`                                       |
