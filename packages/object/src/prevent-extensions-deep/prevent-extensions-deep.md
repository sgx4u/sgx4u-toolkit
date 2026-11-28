# `preventExtensionsDeep`

Prevents extensions on `value` and every nested object, then returns the same reference. The walk matches `freezeDeep`. Existing properties stay configurable, so the object is not sealed. Primitives and functions are returned as-is. The only mutation is `Object.preventExtensions`.

`{ value, circular }` is options only when `circular` is an own key and the object has no other string keys. `{ value: something }` alone is locked as data.

`"throw"` raises `RangeError` on a cycle before any object is locked. `"skip"` and `"replace"` lock the cycle once, the same as `"preserve"`.

## Import

```ts
import { preventExtensionsDeep } from "@sgx4u/object";
```

## Signature

```ts
function preventExtensionsDeep(value: unknown): unknown;
```

## Options

| Option     | Default      | Meaning                                                                    |
| ---------- | ------------ | -------------------------------------------------------------------------- |
| `value`    |              | The value to lock when the argument is options.                            |
| `circular` | `"preserve"` | An own `circular` key selects the options form. `"throw"` rejects a cycle. |

Unknown `circular` throws `RangeError`.

## Example

```ts
const value = { id: 1 };
preventExtensionsDeep(value);
// Object.isExtensible(value) === false
```

## Edge cases

| Input                             | Result                                                         |
| --------------------------------- | -------------------------------------------------------------- |
| A plain object                    | Not extensible, and not sealed                                 |
| Nested objects and set values     | Not extensible                                                 |
| A cycle with `circular: "throw"`  | `RangeError`. The value stays extensible                       |
| `{ value, circular: "preserve" }` | The inner value is locked. The options object stays extensible |
| `null` or a number                | Returned as-is                                                 |
