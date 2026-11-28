# `clone`

Copies `value` one level deep by calling `cloneShallowValue`. Primitives, functions, `WeakMap`, and `WeakSet` are returned as-is. Containers are new instances. Nested values stay shared. The input is left unchanged.

## Import

```ts
import { clone } from "@sgx4u/object";
```

## Signature

```ts
function clone<T>(value: T): T;
```

## Options

There are no options. Pass the value directly.

## Example

```ts
const nested = { b: 1 };
const copied = clone({ a: nested });
// copied.a === nested
```

## Edge cases

| Input                                              | Result                                                |
| -------------------------------------------------- | ----------------------------------------------------- |
| `null`, a number, a string, a boolean, `undefined` | The same value                                        |
| A function, `WeakMap`, or `WeakSet`                | The same reference                                    |
| A plain object or array                            | A new container. Nested objects and arrays are shared |
| A `Date`                                           | A new `Date` with the same time value                 |
