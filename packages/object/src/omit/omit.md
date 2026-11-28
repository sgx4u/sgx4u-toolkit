# `omit`

Copies a plain object without the named keys. When none of the object's own enumerable string keys are named, the same object is returned. Otherwise the result is new. The input is not mutated, and nested values keep their references.

## Import

```ts
import { omit } from "@sgx4u/object";
```

## Signature

```ts
function omit(params: OmitParams): Record<string, unknown> | undefined;
```

## Options

| Option   | Type                     | Description                                                                                                               |
| -------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `object` | `unknown`                | Plain object to copy. Arrays, primitives, `null`, and other non-plain values return `undefined`.                          |
| `keys`   | `readonly PropertyKey[]` | Enumerable string keys to leave out. A number matches the string key of the same digits. A non-array returns `undefined`. |

## Example

```ts
omit({ object: { id: 1, name: "Ada" }, keys: ["name"] });
// { id: 1 }
```

## Edge cases

| Case                             | Result                                                                                          |
| -------------------------------- | ----------------------------------------------------------------------------------------------- |
| No named key is present          | The same object.                                                                                |
| A new result                     | Enumerable string keys that were not named. Symbol keys and non-enumerable keys are not copied. |
| A dangerous key that is kept     | Written with `Object.defineProperty`. `Object.prototype` is unchanged.                          |
| A null-prototype source          | The copy is null-prototype. An unchanged object is the same reference.                          |
| An array, `null`, or a primitive | `undefined`. The function does not throw.                                                       |
