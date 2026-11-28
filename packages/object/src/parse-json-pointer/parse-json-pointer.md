# `parseJSONPointer`

Parses an RFC 6901 JSON Pointer into path segments. `""` is the whole document. Any other pointer starts with `/`. A value that is not a pointer returns `undefined`. The function does not throw.

## Import

```ts
import { parseJSONPointer } from "@sgx4u/object/json-patch";
```

## Signature

```ts
function parseJSONPointer(pointer: unknown): PathSegment[] | undefined;
```

`PathSegment` is `string | number`. A canonical array index such as `"0"` or `"12"` becomes a number. `"01"`, `"-1"`, and the append token `"-"` stay strings.

## Text rules

- `""` returns `[]`.
- `~1` is `/` and `~0` is `~`. `~` is decoded before the rest of the token, so `~01` is `~` followed by `1`.
- A `~` that is not `~0` or `~1` returns `undefined`.
- A non-empty pointer that does not start with `/` returns `undefined`.
- A non-string returns `undefined`.

## Examples

```ts
parseJSONPointer(""); // []
parseJSONPointer("/a~1b/0"); // ["a/b", 0]
parseJSONPointer("/-"); // ["-"]
parseJSONPointer("a"); // undefined
parseJSONPointer(1); // undefined
```

## Edge cases

| Value                      | Result      |
| -------------------------- | ----------- |
| `""`                       | `[]`        |
| `"/"`                      | `[""]`      |
| `"//a"`                    | `["", "a"]` |
| `"/01"`                    | `["01"]`    |
| `"/~"` and `"/~2"`         | `undefined` |
| `null`, a number, an array | `undefined` |
