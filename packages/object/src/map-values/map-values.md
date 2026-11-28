# `mapValues`

Copies a plain object and replaces each value with `mapper(value, key, object)`.

## Import

```ts
import { mapValues, type MapValuesParams } from "@sgx4u/object";
```

## Signature

```ts
function mapValues(
    params: MapValuesParams,
): Record<string, unknown> | undefined;
```

`deep` defaults to `false`. When it is true, nested plain objects and objects inside arrays are mapped before the parent mapper sees them. Primitive array elements are copied and are not passed to `mapper`.

## Examples

```ts
mapValues({
    object: { a: 1, b: { c: 2 } },
    mapper: (value) => (typeof value === "number" ? value * 2 : value),
    deep: true,
});
// { a: 2, b: { c: 4 } }
```

## Edge cases

`mapper` throws `TypeError` when it is not a function. `null`, primitives, and arrays return `undefined`. The input is not mutated. Dangerous source keys are skipped. A cycle points at the new object.
