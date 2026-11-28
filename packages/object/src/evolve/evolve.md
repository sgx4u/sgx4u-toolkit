# `evolve`

Returns a plain object with per-key transformations applied. The inputs are not mutated.

## Import

```ts
import { evolve } from "@sgx4u/object";
```

## Signature

```ts
function evolve(params: EvolveParams): Record<string, unknown> | undefined;
```

`transformations` maps a key to a function `(value: unknown) => unknown` or to a nested plain object of the same shape.

## Behavior

A function is called with the value at that key. A nested plain object evolves that value when the value is also a plain object. A listed key that is missing is skipped. Keys that are not listed keep their original references. When no listed key changes the value, the original object is returned.

A value that is not a plain object returns `undefined`. Arrays are not evolved. When `transformations` is not a plain object, the original object is returned.

## Examples

```ts
evolve({
    object: { name: "ada", address: { city: " paris " } },
    transformations: {
        name: (value) => String(value).toUpperCase(),
        address: { city: (value) => String(value).trim() },
    },
});
// { name: "ADA", address: { city: "paris" } }
```

## Edge cases

| Call                             | Result                    |
| -------------------------------- | ------------------------- |
| Listed key is missing            | Skipped                   |
| Nested rule on a non-plain value | That value is kept        |
| No key changes                   | The same object reference |
| `null`, an array, or a primitive | `undefined`               |
