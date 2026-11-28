# `splitObject`

Splits a plain object into the named keys and the rest. Each own enumerable string key is visited once. Both `picked` and `omitted` are new objects. The input is not mutated, and nested values keep their references.

## Import

```ts
import { splitObject } from "@sgx4u/object";
```

## Signature

```ts
function splitObject(params: SplitObjectParams): SplitObjectResult | undefined;
```

`SplitObjectResult` is `{ picked, omitted }`. Both values are `Record<string, unknown>`.

## Options

| Option   | Type                     | Description                                                                                                                   |
| -------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `object` | `unknown`                | Plain object to split. Any other value returns `undefined`.                                                                   |
| `keys`   | `readonly PropertyKey[]` | Keys placed in `picked` when they exist. A number matches the string key of the same digits. A non-array returns `undefined`. |

## Example

```ts
splitObject({ object: { id: 1, name: "Ada" }, keys: ["id"] });
// { picked: { id: 1 }, omitted: { name: "Ada" } }
```

## Edge cases

| Case                                | Result                                                                             |
| ----------------------------------- | ---------------------------------------------------------------------------------- |
| A named key that is missing         | Left out of `picked`. It is not created.                                           |
| `keys` is empty                     | `picked` is empty. `omitted` has every enumerable string key and is not the input. |
| Symbol keys and non-enumerable keys | Not copied to either side.                                                         |
| A dangerous key                     | Written with `Object.defineProperty` onto the side that receives it.               |
| A null-prototype source             | Both results are null-prototype.                                                   |
| An array, `null`, or a primitive    | `undefined`. The function does not throw.                                          |
