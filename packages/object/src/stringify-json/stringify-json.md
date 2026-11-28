# `stringifyJSON`

Stringifies a value with `JSON.stringify` rules, plus stable key order and a cycle policy.

## Import

```ts
import { stringifyJSON } from "@sgx4u/object";
```

## Signature

```ts
function stringifyJSON(value: unknown): string | undefined;
function stringifyJSON(params: StringifyJSONParams): string | undefined;
```

The options object is recognized when it is a plain object, owns `value`, and owns no string key other than `value`, `space`, `stable`, and `circular`.

## Behavior

`undefined`, a function, a symbol, or a bigint at the root returns `undefined`. A nested bigint throws `TypeError`, matching `JSON.stringify`. `toJSON`, boxed primitives, dates, holes, and indentation follow `JSON.stringify`.

`stable: true` sorts object keys with the default string sort, which is UTF-16 code unit order, not `localeCompare`. Array order is unchanged.

`circular` defaults to `"throw"`, which raises `RangeError` when a value points at an ancestor. `"skip"` omits that object key and writes `null` for an array element. `"replace"` writes the JSON string `"[Circular]"`. `"preserve"` and any other value throw `RangeError`. `space` uses the same number and string rules as `JSON.stringify`, including the 10-character cap.

## Examples

```ts
stringifyJSON({ b: 1, a: 2 }); // '{"b":1,"a":2}'

stringifyJSON({ stable: true, value: { b: 1, a: 2 } }); // '{"a":2,"b":1}'
```

## Edge cases

| Call                                          | Result                              |
| --------------------------------------------- | ----------------------------------- |
| Root `undefined`, function, symbol, or bigint | `undefined`                         |
| Nested bigint                                 | `TypeError`                         |
| Cycle, default `circular`                     | `RangeError`                        |
| `circular: "skip"` on an object key           | The key is omitted                  |
| `circular: "skip"` on an array element        | `null`                              |
| `circular: "replace"`                         | `"[Circular]"`                      |
| `circular: "preserve"`                        | `RangeError`                        |
| `{ value: 1, extra: 2 }`                      | Stringified as data, not as options |
