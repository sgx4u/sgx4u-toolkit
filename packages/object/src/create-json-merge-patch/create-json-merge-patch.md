# `createJSONMergePatch`

Builds an RFC 7396 JSON Merge Patch from `first` to `second`. The result is JSON, or `undefined` when a change cannot be represented as JSON.

## Import

```ts
import { createJSONMergePatch } from "@sgx4u/object/json-patch";
```

## Signature

```ts
function createJSONMergePatch(
    params: CreateJSONMergePatchParams,
): JSONValue | undefined;
```

```ts
interface CreateJSONMergePatchParams {
    first: unknown;
    second: unknown;
}
```

## Object diff

When both values are plain objects, the result is an object:

- A key only in `first` becomes `null`.
- A key only in `second` is copied.
- A key in both whose values are both plain objects is compared again. An empty nested patch is omitted.
- Any other changed value is the second value.
- Unchanged keys are omitted. Nothing changed returns `{}`.

Arrays are not merged. If the two values are not both plain objects, the result is `second` when `second` is JSON, and `undefined` otherwise.

RFC 7396 uses `null` inside a patch to mean "remove this key". A JSON `null` in `second` is therefore stored as `null`, and applying the patch removes the key instead of setting `null`. A merge patch cannot store a JSON null.

A nested change that would copy `undefined`, a function, a symbol, a bigint, `NaN`, an infinity, a cycle, or a symbol key returns `undefined` for the whole patch. The result is a clone.

## Examples

```ts
createJSONMergePatch({
    first: { a: "b", b: "c" },
    second: { a: "b", d: "e" },
});
// { b: null, d: "e" }

createJSONMergePatch({
    first: { a: { b: 1, c: 2 } },
    second: { a: { b: 1 } },
});
// { a: { c: null } }

createJSONMergePatch({ first: { a: [1, 2] }, second: { a: [1] } });
// { a: [1] }

createJSONMergePatch({ first: { a: 1 }, second: null }); // null
createJSONMergePatch({ first: 1, second: undefined }); // undefined
```

## Edge cases

| `first`                        | `second`                 | Result             |
| ------------------------------ | ------------------------ | ------------------ |
| `{ a: 1, b: 1 }`               | `{ b: 1, a: 1 }`         | `{}`               |
| `{ a: 1 }`                     | `[1]`                    | `[1]`              |
| `1`                            | `2`                      | `2`                |
| `{ a: 1 }`                     | `{ a: undefined }`       | `undefined`        |
| `{ a: { b: 1 } }`              | `{ a: { b: function } }` | `undefined`        |
| `params` is not a plain object |                          | throws `TypeError` |
