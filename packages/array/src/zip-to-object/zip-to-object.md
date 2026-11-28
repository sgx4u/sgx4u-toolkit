# `zipToObject`

Builds a `Record<string, unknown>` from keys and values. Keys are stringified with `String`. A symbol becomes `String(symbol)`, for example `"Symbol(id)"`.

`values` is an array or `(key, index) => unknown`. A missing array entry is `undefined`. A later duplicate key replaces the earlier value.

## Import

```ts
import { zipToObject } from "@sgx4u/array";
```

## Signature

```ts
function zipToObject(
    params: ZipToObjectParams,
): Record<string, unknown> | undefined;
```

## Parameters

| Name     | Type                                            | Description                                                                  |
| -------- | ----------------------------------------------- | ---------------------------------------------------------------------------- |
| `keys`   | `readonly unknown[]`                            | Keys. Each one is passed through `String`.                                   |
| `values` | `readonly unknown[] \| (key, index) => unknown` | Values aligned with `keys`, or a function of the original key and its index. |

## Examples

```ts
zipToObject({ keys: ["a", "b"], values: [1, 2] }); // { a: 1, b: 2 }
zipToObject({
    keys: ["a", "b"],
    values: (key, index) => index,
}); // { a: 0, b: 1 }
zipToObject({ keys: ["a", "b"], values: [1] }); // { a: 1, b: undefined }
```

## Edge cases

- `null`, a string, or another non-object returns `undefined`.
- `keys` that is missing or not an array throws `TypeError`. `{}`, a typed array, a `Set`, and a generator take this path.
- `values` that is missing, or that is neither an array nor a function, throws `TypeError`.
- Empty `keys` returns `{}` and does not call a value function.
- A hole in `values` is `undefined`.
- The key and value arrays are not mutated. The result is a new object.
