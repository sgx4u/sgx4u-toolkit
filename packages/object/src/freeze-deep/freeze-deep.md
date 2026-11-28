# `freezeDeep`

Freezes `value` and every nested object with `Object.freeze`, then returns the same reference. Map and set contents are frozen. Array elements, plain-object properties, and an error `cause` are included through `forEachChild`. Primitives and functions are returned as-is. The only mutation is the freeze itself.

Pass a value, or `{ value, circular }` when `circular` is an own key. The options form is recognized with `isParameterRecord` for the keys `value` and `circular`, and only when `circular` is present. `{ value: something }` with no `circular` key is data: that object is frozen, including its `value` property.

`"preserve"`, `"skip"`, and `"replace"` all visit a cycle once and freeze it. They do not replace or drop graph edges, because this function returns the original reference. `"throw"` raises `RangeError` when a value points at an ancestor, before any object is frozen. A shared reference that is not a cycle does not throw.

## Import

```ts
import { freezeDeep } from "@sgx4u/object";
```

## Signature

```ts
function freezeDeep(value: unknown): unknown;
```

## Options

| Option     | Default      | Meaning                                                                    |
| ---------- | ------------ | -------------------------------------------------------------------------- |
| `value`    |              | The value to freeze when the argument is options.                          |
| `circular` | `"preserve"` | An own `circular` key selects the options form. `"throw"` rejects a cycle. |

Unknown `circular` throws `RangeError`. The bare-value form uses `"preserve"`.

## Example

```ts
const value = { id: 1 };
freezeDeep(value);
// Object.isFrozen(value) === true
```

## Edge cases

| Input                                      | Result                                           |
| ------------------------------------------ | ------------------------------------------------ |
| `null`, a number, a function               | The same value, not frozen as an object          |
| A cycle                                    | Frozen once                                      |
| `{ value, circular: "throw" }` and a cycle | `RangeError`. The value stays unfrozen           |
| `{ value: data }` with no `circular` key   | `data`'s container is frozen                     |
| `{ value, circular: "preserve" }`          | `value` is frozen. The options object is not     |
| A `Map` or `Set`                           | The container and its object contents are frozen |
