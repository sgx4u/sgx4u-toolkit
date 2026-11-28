# `sortKeys`

Copies a plain object so its keys are in sorted insertion order. Arrays keep their element order. When `deep` is true, which is the default, plain objects inside arrays are sorted too.

## Import

```ts
import { sortKeys, type SortKeysParams } from "@sgx4u/object";
```

## Signature

```ts
function sortKeys(params: SortKeysParams): unknown;
```

The default compare is `localeCompare` with `{ numeric: true }`. `"a2"` comes before `"a10"`. Set `numeric` to `false` for lexicographic order, where `"a10"` comes before `"a2"`. `locale` is a string or a list of locale names and is passed through to `localeCompare`. Omit it to use the runtime locale.

`order` defaults to `"ascending"`. `"descending"` calls the compare function with the arguments swapped. A custom `compare(left, right)` replaces the default.

## Examples

```ts
Object.keys(sortKeys({ object: { a10: 1, a2: 2, a1: 3 } }) as object);
// ["a1", "a2", "a10"]

sortKeys({
    object: [{ b: 1, a: 2 }],
});
// [{ a: 2, b: 1 }]
```

## Edge cases

`compare` throws `TypeError` when the property is present and is not a function. An unknown `order` throws `RangeError`. A `locale` that is not a string or a list of strings throws `RangeError`.

`null` and primitives return `undefined`. The input is not mutated. A null-prototype object stays null-prototype. Dangerous keys are skipped. A cycle points at the new container.
