# `assign`

Copies enumerable string keys from each object-like value into a new object. Later sources overwrite earlier keys. The copy is shallow: nested objects stay shared. The inputs are left unchanged.

## Import

```ts
import { assign } from "@sgx4u/object";
```

## Signature

```ts
function assign(params: AssignParams): Record<string, unknown> | undefined;
```

## Options

`objects` is the list of sources, read from left to right. A non-array makes `assign` return `undefined`.

## Example

```ts
assign({ objects: [{ a: 1, b: 1 }, { a: 2 }] });
// { a: 2, b: 1 }
```

## Edge cases

| Input                                                       | Result                                       |
| ----------------------------------------------------------- | -------------------------------------------- |
| `objects: []`                                               | `{}`                                         |
| Only primitives, `null`, or `undefined`                     | `{}`                                         |
| An array source                                             | Index keys are copied onto the result object |
| `__proto__`, `prototype`, `constructor`                     | Skipped. `({}).polluted` stays falsy         |
| Symbol keys                                                 | Ignored                                      |
| `objects` is not an array, or the argument is not an object | `undefined`                                  |
