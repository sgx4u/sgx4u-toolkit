# `isShallowEqual`

Reports whether two values match one level deep by calling `valuesAreShallowEqual`. Nested objects are compared by reference. Dates compare by time value. The function does not throw.

## Import

```ts
import { isShallowEqual } from "@sgx4u/object";
```

## Signature

```ts
function isShallowEqual(params: IsShallowEqualParams): boolean;
```

## Options

| Option            | Default | Meaning                         |
| ----------------- | ------- | ------------------------------- |
| `first`, `second` |         | The values to compare.          |
| `includeSymbols`  | `false` | Compare enumerable symbol keys. |

## Example

```ts
isShallowEqual({ first: { a: 1 }, second: { a: 1 } });
// true
```

## Edge cases

| Values                                           | Result                                        |
| ------------------------------------------------ | --------------------------------------------- |
| `{ a: nested }` twice, same `nested`             | `true`                                        |
| `{ a: { b: 1 } }` twice, different inner objects | `false`                                       |
| `NaN` and `NaN`, `+0` and `-0`                   | `true`                                        |
| Symbol keys                                      | Compared only when `includeSymbols` is `true` |
| Argument is not an object                        | `false`                                       |
