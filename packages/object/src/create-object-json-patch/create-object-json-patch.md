# `createObjectJSONPatch`

Returns a frozen JSON Patch API with one `ObjectConfig` bound in. Each call has its own functions. There is no shared mutable config, so two instances do not affect each other.

## Import

```ts
import { createObjectJSONPatch } from "@sgx4u/object/json-patch";
```

## Signature

```ts
function createObjectJSONPatch(config?: ObjectConfig): ObjectJSONPatch;
```

`ObjectJSONPatch` holds `parseJSONPointer`, `formatJSONPointer`, `createJSONPatch`, `applyJSONPatch`, `isValidJSONPatch`, `createJSONMergePatch`, and `applyJSONMergePatch`.

## Bound options

`prototypeKeys` is the default for `applyJSONPatch` and `applyJSONMergePatch`. A `prototypeKeys` on a call replaces it. The default when `config` is omitted is `"skip"`.

`pathStyle`, `pathDelimiter`, and `prototypeKeys` are validated. `arrayMerge`, `circular`, `prototypes`, and the boolean flags are checked and then unused. `keyCase`, `emptyValues`, `locale`, and `maxDepth` are ignored. Patch paths are JSON Pointers, so `pathStyle` does not change parsing. Unknown keys are ignored.

The bound value is read when the factory runs. Changing the config object later does not change the instance.

## Examples

```ts
const api = createObjectJSONPatch({ prototypeKeys: "skip" });

api.applyJSONPatch({
    object: { a: 1 },
    patch: [{ op: "add", path: "/b", value: 2 }],
});
// { a: 1, b: 2 }

api.applyJSONPatch({
    object: {},
    patch: [{ op: "add", path: "/__proto__", value: { polluted: true } }],
    prototypeKeys: "keep",
});
// own "__proto__" is set; ({}).polluted stays unset
```

## Edge cases

| `config`                                                      | Result                               |
| ------------------------------------------------------------- | ------------------------------------ |
| omitted                                                       | `prototypeKeys` defaults to `"skip"` |
| `{ extra: 1 }`                                                | the unknown key is ignored           |
| `null`, an array, or a number                                 | throws `TypeError`                   |
| `{ pathDelimiter: "" }`                                       | throws `RangeError`                  |
| `{ pathStyle: "nope" }` or `{ prototypeKeys: "nope" }`        | throws `RangeError`                  |
| `{ arrayMerge: "nope" }`                                      | throws `RangeError`                  |
| `{ keyCase: "nope" }`, `{ locale: 1 }`, or `{ maxDepth: -1 }` | ignored                              |
