# `sealDeep`

Seals `value` and every nested object with `Object.seal`, then returns the same reference. The walk matches `freezeDeep`: map and set contents are included, cycles are visited once, and primitives and functions are returned as-is. Existing properties stay writable. The only mutation is the seal itself.

`{ value, circular }` is options only when `circular` is an own key and the object has no other string keys. `{ value: something }` alone is sealed as data.

`"throw"` raises `RangeError` on a cycle before any object is sealed. `"skip"` and `"replace"` seal the cycle once, the same as `"preserve"`.

## Import

```ts
import { sealDeep } from "@sgx4u/object";
```

## Signature

```ts
function sealDeep(value: unknown): unknown;
```

## Options

| Option     | Default      | Meaning                                                                    |
| ---------- | ------------ | -------------------------------------------------------------------------- |
| `value`    |              | The value to seal when the argument is options.                            |
| `circular` | `"preserve"` | An own `circular` key selects the options form. `"throw"` rejects a cycle. |

Unknown `circular` throws `RangeError`.

## Example

```ts
const value = { id: 1 };
sealDeep(value);
// Object.isSealed(value) === true
```

## Edge cases

| Input                                          | Result                                 |
| ---------------------------------------------- | -------------------------------------- |
| A plain object                                 | Sealed, and still writable             |
| Nested objects, arrays, map values, set values | Sealed                                 |
| A cycle with the default policy                | Sealed once                            |
| `circular: "throw"` and a cycle                | `RangeError`. The value stays unsealed |
| `{ value: data }` with no `circular` key       | That object is sealed as data          |
