# `mapEntries`

Copies a plain object and replaces each entry. The mapper is called as `mapper(key, value, object)` and returns `[newKey, newValue]` or `mapSkip`.

## Import

```ts
import { mapEntries, mapSkip, type MapEntriesParams } from "@sgx4u/object";
```

## Signature

```ts
function mapEntries(
    params: MapEntriesParams,
): Record<string, unknown> | undefined;
const mapSkip: unique symbol;
```

Return `mapSkip` to drop the entry. Any other symbol is a normal value. `deep` defaults to `false`. When it is true, nested plain objects and objects inside arrays are mapped first, and that mapped container is the `value` argument.

## Examples

```ts
mapEntries({
    object: { a: 1, b: 2 },
    mapper: (key, value) =>
        key === "a" ? mapSkip : [key.toUpperCase(), value],
});
// { B: 2 }
```

## Edge cases

A mapper that returns neither a pair nor `mapSkip` throws `TypeError`. A mapper that is not a function throws `TypeError`. A dangerous new key is skipped. When two entries share a key, the later one wins.

`null`, primitives, and arrays return `undefined`. The input is not mutated.
