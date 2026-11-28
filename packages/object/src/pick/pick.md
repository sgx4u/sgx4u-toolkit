# `pick`

Copies the named own keys onto a new object. Missing keys are left out. The input is not mutated, and nested values keep their references.

Arrays, primitives, `null`, functions, dates, and class instances return `undefined`. Only plain objects are copied, including objects whose prototype is `null`.

## Import

```ts
import { pick } from "@sgx4u/object";
```

## Signature

```ts
function pick(params: PickParams): Record<string, unknown> | undefined;
```

## Options

| Option   | Type                     | Description                                                         |
| -------- | ------------------------ | ------------------------------------------------------------------- |
| `object` | `unknown`                | Plain object to copy. Any other value returns `undefined`.          |
| `keys`   | `readonly PropertyKey[]` | Own keys to copy, in result order. A non-array returns `undefined`. |

## Example

```ts
pick({ object: { id: 1, name: "Ada" }, keys: ["id", "missing"] });
// { id: 1 }
```

## Edge cases

| Case                                                                | Result                                                                   |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| A key that is not an own property                                   | Omitted. Inherited keys are not copied.                                  |
| The same key twice                                                  | Written once, at its first position.                                     |
| A number key such as `1`                                            | Matches the string property `"1"`.                                       |
| A named symbol, or a non-enumerable own key                         | Copied. The copy is enumerable.                                          |
| `__proto__`, `prototype`, or `constructor`                          | Copied with `Object.defineProperty`, so `Object.prototype` is unchanged. |
| A null-prototype source                                             | The result is null-prototype.                                            |
| `keys` is a string, or `object` is an array, `null`, or a primitive | `undefined`. The function does not throw.                                |
