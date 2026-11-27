# `renameKeys`

Copies a plain object and renames the keys listed in `mapping`. Other keys stay. The same mapping is used at every level when `deep` is true.

## Import

```ts
import { renameKeys, type RenameKeysParams } from "@sgx4u/object";
```

## Signature

```ts
function renameKeys(
    params: RenameKeysParams,
): Record<string, unknown> | undefined;
```

`deep` defaults to `false`. Deep mode renames nested plain objects and objects inside arrays. An array at the root returns `undefined`.

## Examples

```ts
renameKeys({
    object: { items: [{ first_name: "Ada" }] },
    mapping: { first_name: "firstName", items: "list" },
    deep: true,
});
// { list: [{ firstName: "Ada" }] }
```

When two keys land on the same name, the later value wins. A target of `"__proto__"`, `"prototype"`, or `"constructor"` is skipped.

## Edge cases

`mapping` throws `TypeError` when it is not a plain object. A mapping value that is not a string, number, or symbol is ignored. The input is not mutated. `null` and primitives return `undefined`.
