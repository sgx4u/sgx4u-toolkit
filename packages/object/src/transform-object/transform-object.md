# `transformObject`

Reduces the own enumerable string keys of a plain object.

## Import

```ts
import { transformObject } from "@sgx4u/object";
```

## Signature

```ts
function transformObject<A>(params: TransformObjectParams<A>): A | undefined;
```

`transformer` is called as `transformer(accumulator, value, key, object)`.

## Behavior

Keys run in insertion order. The accumulator is not copied: if the transformer mutates it and returns it, that same value comes back. An empty object returns `initial`. A value that is not a plain object returns `undefined`.

## Examples

```ts
transformObject({
    initial: 0,
    object: { a: 1, b: 2 },
    transformer: (sum, value) => sum + Number(value),
}); // 3
```

## Edge cases

| Call                                     | Result         |
| ---------------------------------------- | -------------- |
| Empty plain object                       | `initial`      |
| Array, `null`, or class instance         | `undefined`    |
| Transformer returns the same accumulator | That reference |
| `transformer` is not a function          | `TypeError`    |
