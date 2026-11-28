# `parseJSON`

Parses JSON text and drops `__proto__`, `prototype`, and `constructor`.

## Import

```ts
import { parseJSON } from "@sgx4u/object";
```

## Signature

```ts
function parseJSON(text: string): unknown;
function parseJSON(params: { text: string; reviver?: JSONReviver }): unknown;
function parseJSON(text: unknown): unknown;
```

The options object is recognized when it is a plain object, owns `text`, and owns no string key other than `text` and `reviver`.

## Behavior

`JSON.parse` runs with a reviver wrapper. When the current key is dangerous, the wrapper returns `undefined`, which deletes that key, even if the caller's reviver returned a value for it. A final walk also drops dangerous keys on objects the reviver built. Objects with none of those keys keep their references.

Invalid JSON returns `undefined`. A non-string `text`, or an argument that is neither a string nor the options object, returns `undefined`. A `SyntaxError` from `JSON.parse` is caught. Other errors, including a throw from the reviver, propagate.

## Examples

```ts
parseJSON('{"id":1}'); // { id: 1 }

parseJSON({
    text: '{"__proto__":{"admin":true},"role":"user"}',
    reviver: (_key, value) => value,
}); // { role: "user" }
```

## Edge cases

| Call                                  | Result                                            |
| ------------------------------------- | ------------------------------------------------- |
| `"null"`, `"0"`, `"[]"`               | `null`, `0`, `[]`                                 |
| `"{"`, `""`                           | `undefined`                                       |
| A number, `null`, or other non-string | `undefined`                                       |
| `{ text, extra }`                     | `undefined`, because it is not the options object |
| `reviver` present and not a function  | `TypeError`                                       |
| Dangerous key inside a reviver result | Removed, without mutating the reviver's object    |
