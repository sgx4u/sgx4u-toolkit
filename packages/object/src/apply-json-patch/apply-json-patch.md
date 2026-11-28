# `applyJSONPatch`

Applies an RFC 6902 JSON Patch and returns a new document. `object` is not mutated. A failed `"test"`, or a missing target while `strict` is `true`, returns `undefined`. The failed copy is discarded.

Every operation is checked before the first edit. A malformed operation throws `RangeError` even when an earlier operation would have succeeded.

## Import

```ts
import { applyJSONPatch } from "@sgx4u/object/json-patch";
```

## Signature

```ts
function applyJSONPatch(params: ApplyJSONPatchParams): unknown;
```

```ts
interface ApplyJSONPatchParams {
    object: unknown;
    patch: readonly JSONPatchOperation[];
    strict?: boolean; // default true
    prototypeKeys?: "skip" | "throw" | "keep"; // default "skip"
}
```

`undefined` means the patch failed. A successful document of `undefined` is not distinguished from failure.

## Operations

- `"add"` on `""` replaces the document. On an array, `"-"` appends and an index inserts, shifting later items. An index greater than `length` fails. On an object, the member is added or overwritten.
- `"remove"` deletes an object member. An array index is spliced out. Removing `""` fails.
- `"replace"` overwrites an existing value, including `""`. It does not insert an array element.
- `"move"` removes `from`, then adds that value at `path`. Indexes in `path` are read after the removal. `from` must not be a proper prefix of `path`. That move returns `undefined` even when `strict` is `false`.
- `"copy"` adds a clone of `from` at `path`. The source stays.
- `"test"` compares the value with JSON equality: key order does not matter, array order does, `NaN` equals `NaN`. A missing path fails even when `strict` is `false`.

`strict: false` skips a missing target for `"add"`, `"remove"`, `"replace"`, `"move"`, and `"copy"`, then continues. It does not skip a failed test or a move into a child.

## Dangerous keys

`__proto__`, `prototype`, and `constructor` follow `prototypeKeys`. `"skip"` does not read or write them and does not walk `Object.prototype`, so a pointer such as `/__proto__/polluted` cannot set `({}).polluted`. `"throw"` raises `RangeError`. `"keep"` writes an own data property with `Object.defineProperty`.

Unchanged nested values keep their references. Values taken from the patch are cloned. A class instance other than `Date` is shared. A `Date` is copied.

## Examples

```ts
applyJSONPatch({
    object: { a: 1 },
    patch: [{ op: "add", path: "/b", value: 2 }],
});
// { a: 1, b: 2 }

applyJSONPatch({
    object: [1, 2],
    patch: [{ op: "add", path: "/1", value: 9 }],
});
// [1, 9, 2]

applyJSONPatch({
    object: { a: 1 },
    patch: [{ op: "test", path: "/a", value: 0 }],
});
// undefined
```

## Edge cases

| Patch                                                              | `strict` | Result                              |
| ------------------------------------------------------------------ | -------- | ----------------------------------- |
| malformed `op`, missing `path`, missing `value`, or missing `from` | either   | throws `RangeError` before any edit |
| `"remove"` of a missing path                                       | `true`   | `undefined`                         |
| `"remove"` of a missing path                                       | `false`  | the operation is skipped            |
| `"test"` of a missing path                                         | `false`  | `undefined`                         |
| `"move"` from `/a` to `/a/b`                                       | `false`  | `undefined`                         |
| `"add"` with path `/__proto__/polluted`                            | either   | does not set `({}).polluted`        |
| empty `patch`                                                      | either   | the same `object` reference         |
| `params` is not a plain object                                     | either   | throws `TypeError`                  |
