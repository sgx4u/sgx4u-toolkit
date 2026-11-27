# `invertBy`

Groups the own enumerable string keys of a plain object. The group name is `String(iteratee(value, key, object))`. The first time a group appears sets its place. Keys inside a group stay in enumeration order.

## Import

```ts
import { invertBy, type InvertByParams } from "@sgx4u/object";
```

## Signature

```ts
function invertBy(params: InvertByParams): Record<string, string[]> | undefined;
```

Pass `{ object, iteratee? }`. Omit `iteratee` to group by `String(value)`.

## Examples

```ts
invertBy({ object: { a: 1, b: 2, c: 1 } });
// { "1": ["a", "c"], "2": ["b"] }

invertBy({
    object: { a: "x", b: "yy" },
    iteratee: (value) => String(value).length,
});
// { "1": ["a"], "2": ["b"] }
```

## Edge cases

`null`, primitives, and arrays return `undefined`. A bare object that is not the options object returns `undefined`.

`iteratee` throws `TypeError` when the property is present and is not a function. A group named `"__proto__"`, `"prototype"`, or `"constructor"` is skipped. The input is not mutated.
