# `invert`

Swaps the keys and values of a plain object. The new key is the value when that value is a string, number, or symbol. Every other value is keyed with `String(value)`. The stored value is the original key.

## Import

```ts
import { invert, type DuplicateValues, type InvertParams } from "@sgx4u/object";
```

## Signature

```ts
function invert(object: object): Record<string, string> | undefined;
function invert(params: InvertParams): InvertResult | undefined;
```

`InvertParams` is `{ object, duplicateValues? }`. The options object is recognized only when it is a plain object that owns `object` and has no keys other than `object` and `duplicateValues`. A data object with extra keys is inverted as data.

## `duplicateValues`

| Value     | Result                                                   |
| --------- | -------------------------------------------------------- |
| `"last"`  | The later key overwrites. This is the default.           |
| `"first"` | The earliest key stays.                                  |
| `"array"` | Each inverted value maps to the original keys, in order. |
| `"throw"` | `RangeError` when two values produce the same key.       |

An unknown `duplicateValues` throws `RangeError`.

## Examples

```ts
invert({ a: 1, b: 1, c: 2 });
// { "1": "b", "2": "c" }

invert({ object: { a: true, b: null }, duplicateValues: "array" });
// { true: ["a"], null: ["b"] }
```

## Edge cases

`null`, primitives, and arrays return `undefined`. The input is not mutated. A null-prototype object stays null-prototype.

A result key of `"__proto__"`, `"prototype"`, or `"constructor"` is skipped, including when `duplicateValues` is `"throw"`. A symbol value becomes a symbol key.
