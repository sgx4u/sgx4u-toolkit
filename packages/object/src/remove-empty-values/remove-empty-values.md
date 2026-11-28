# `removeEmptyValues`

Copies a plain object or array and drops values selected by `emptyValues`. The default list is `["undefined"]`, so `null`, `""`, `0`, `false`, `NaN`, and empty containers stay.

## Import

```ts
import { removeEmptyValues, type RemoveEmptyValuesParams } from "@sgx4u/object";
```

## Signature

```ts
function removeEmptyValues(params: RemoveEmptyValuesParams): unknown;
```

| Name            | Dropped value                                                    |
| --------------- | ---------------------------------------------------------------- |
| `"undefined"`   | `undefined`, including an array hole                             |
| `"null"`        | `null`                                                           |
| `"emptyString"` | `""`                                                             |
| `"emptyArray"`  | an array whose length is `0` after cleaning                      |
| `"emptyObject"` | a plain object with no own enumerable string keys after cleaning |
| `"nan"`         | `Number.NaN` only                                                |

`0`, `false`, and every other number are kept when `"nan"` is listed. A boxed number is not `NaN`.

`deep` defaults to `true`. Children are cleaned first. A nested object or array is removed only when it is empty afterwards and the matching kind is listed. Empty array elements are removed and later elements shift.

## Examples

```ts
removeEmptyValues({ object: { id: 1, name: undefined, count: 0 } });
// { id: 1, count: 0 }

removeEmptyValues({
    object: { a: Number.NaN, b: 0 },
    emptyValues: ["nan"],
});
// { b: 0 }

removeEmptyValues({ object: { a: [1, undefined, 2] } });
// { a: [1, 2] }
```

## Edge cases

An unknown name throws `RangeError`. `null` and primitives return `undefined`. The input is not mutated. Dangerous keys are skipped. A cycle points at the new container.
