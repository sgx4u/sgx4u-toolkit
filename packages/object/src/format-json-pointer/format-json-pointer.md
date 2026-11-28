# `formatJSONPointer`

Formats path segments as an RFC 6901 JSON Pointer. An empty list is `""`, the whole document. A value that is not an array of strings and finite numbers returns `undefined`. The function does not throw.

## Import

```ts
import { formatJSONPointer } from "@sgx4u/object/json-patch";
```

## Signature

```ts
function formatJSONPointer(segments: unknown): string | undefined;
```

`~` is escaped before `/`, so a slash written by an escape is not escaped again. `a/b` becomes `a~1b`. `m~n` becomes `m~0n`.

## Examples

```ts
formatJSONPointer([]); // ""
formatJSONPointer(["a/b", 0]); // "/a~1b/0"
formatJSONPointer(["m~n"]); // "/m~0n"
formatJSONPointer("a"); // undefined
formatJSONPointer([Number.NaN]); // undefined
```

## Edge cases

| Value                               | Result       |
| ----------------------------------- | ------------ |
| `[]`                                | `""`         |
| `["a/b~c"]`                         | `"/a~1b~0c"` |
| a string, `null`, or a plain object | `undefined`  |
| an array containing a symbol        | `undefined`  |
| `NaN` or an infinity                | `undefined`  |
