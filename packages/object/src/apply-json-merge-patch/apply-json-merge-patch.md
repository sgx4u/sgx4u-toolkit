# `applyJSONMergePatch`

Applies an RFC 7396 JSON Merge Patch and returns a new value. `object` and `patch` are not mutated.

## Import

```ts
import { applyJSONMergePatch } from "@sgx4u/object/json-patch";
```

## Signature

```ts
function applyJSONMergePatch(params: ApplyJSONMergePatchParams): unknown;
```

```ts
interface ApplyJSONMergePatchParams {
    object: unknown;
    patch: unknown;
    prototypeKeys?: "skip" | "throw" | "keep"; // default "skip"
}
```

## Behavior

A patch that is not a plain object replaces the document with a clone of the patch. `null`, arrays, numbers, and strings replace. A `Date` is copied. A class instance other than `Date` is shared.

A plain-object patch clones a plain-object target. Any other target is treated as `{}` before the keys are applied:

- `null` removes the key.
- A plain object merges into that key.
- Any other value is stored as a clone.

`__proto__`, `prototype`, and `constructor` follow `prototypeKeys`. `"skip"` does not write them and does not set `({}).polluted`. `"throw"` raises `RangeError`. `"keep"` writes an own data property.

## Examples

```ts
applyJSONMergePatch({
    object: { a: 1, b: 2 },
    patch: { b: null, c: 3 },
});
// { a: 1, c: 3 }

applyJSONMergePatch({
    object: { a: { b: 1, keep: true } },
    patch: { a: { b: 3 } },
});
// { a: { b: 3, keep: true } }

applyJSONMergePatch({ object: { a: 1 }, patch: [1, 2] }); // [1, 2]
applyJSONMergePatch({ object: [1], patch: { a: 1 } }); // { a: 1 }
```

## Edge cases

| `patch`                                               | Result                                          |
| ----------------------------------------------------- | ----------------------------------------------- |
| `null`                                                | `null`                                          |
| an array                                              | a clone of the array                            |
| `{ __proto__: { polluted: true } }` from `JSON.parse` | the key is skipped; `({}).polluted` stays unset |
| `prototypeKeys: "throw"` and a dangerous key          | throws `RangeError`; the input is unchanged     |
| `params` is not a plain object                        | throws `TypeError`                              |
