# `isValidJSONPatch`

Reports whether a value is an array of well-formed RFC 6902 operations. The function does not throw.

## Import

```ts
import { isValidJSONPatch } from "@sgx4u/object/json-patch";
```

## Signature

```ts
function isValidJSONPatch(value: unknown): boolean;
```

An empty array is valid. Each operation is a plain object:

- `op` is `"add"`, `"remove"`, `"replace"`, `"move"`, `"copy"`, or `"test"`.
- `path` is an RFC 6901 pointer. `""` is valid. A pointer that does not start with `/`, and a bad `~` escape, are not.
- `"add"`, `"replace"`, and `"test"` have an own `value`. The value may be `undefined`.
- `"move"` and `"copy"` have a `from` pointer.
- Extra fields are allowed.

## Examples

```ts
isValidJSONPatch([]); // true
isValidJSONPatch([{ op: "remove", path: "/a" }]); // true
isValidJSONPatch([{ op: "add", path: "/a" }]); // false
isValidJSONPatch({ op: "remove", path: "/a" }); // false
isValidJSONPatch(null); // false
```

## Edge cases

| Value                                                              | Result  |
| ------------------------------------------------------------------ | ------- |
| `[{ op: "test", path: "", value: 1 }]`                             | `true`  |
| `[{ op: "move", from: "/a", path: "/b", extra: true }]`            | `true`  |
| `[{ op: "add", path: "a", value: 1 }]`                             | `false` |
| `[{ op: "copy", path: "/a" }]`                                     | `false` |
| `null`, a number, one operation object that is not inside an array | `false` |
