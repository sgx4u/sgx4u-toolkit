# `createEmptyObject`

Creates an object with `Object.create`.

## Import

```ts
import { createEmptyObject } from "@sgx4u/object";
```

## Signature

```ts
function createEmptyObject(): object;
function createEmptyObject(params: { prototype: object | null }): object;
```

## Behavior

A call with no argument uses a `null` prototype. The options form is recognized when the argument is a plain object, owns `prototype`, and owns no other string key. `prototype` may be `null`, an object, or a function. Any other present value throws `TypeError`. An argument that is not that options object also throws `TypeError`.

## Examples

```ts
createEmptyObject(); // Object.create(null)

const prototype = { kind: "base" };
Object.getPrototypeOf(createEmptyObject({ prototype })) === prototype; // true
```

## Edge cases

| Call                                            | Result                              |
| ----------------------------------------------- | ----------------------------------- |
| No argument, or `{ prototype: null }`           | `Object.create(null)`               |
| `{ prototype: someObject }`                     | An empty object with that prototype |
| A function prototype                            | Accepted                            |
| `prototype` is a string, number, or `undefined` | `TypeError`                         |
| Extra own string keys, or a non-object argument | `TypeError`                         |
