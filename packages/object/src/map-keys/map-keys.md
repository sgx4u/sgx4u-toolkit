# `mapKeys`

Copies a plain object and replaces each key with `mapper(key, value, object)`. `value` is the original value. The stored value is the deep-mapped child when `deep` is true.

## Import

```ts
import { mapKeys, type MapKeysParams } from "@sgx4u/object";
```

## Signature

```ts
function mapKeys(params: MapKeysParams): Record<string, unknown> | undefined;
```

`deep` defaults to `false`. When it is true, nested plain objects and objects inside arrays are mapped too. Array indexes are not passed to `mapper`.

## Examples

```ts
mapKeys({
    object: { a: 1, b: 2 },
    mapper: (key) => key.toUpperCase(),
});
// { A: 1, B: 2 }
```

When two keys map to the same name, the later value wins. A mapped key of `"__proto__"`, `"prototype"`, or `"constructor"` is skipped.

## Edge cases

`mapper` throws `TypeError` when it is not a function. `null`, primitives, and arrays return `undefined`. The input is not mutated.

A repeated nested object stays one shared copy. A cycle points at the new object, not at the input.
