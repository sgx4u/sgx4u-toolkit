# `isValidJSON`

Reports whether a value is JSON text that `parseJSON` accepts. It does not throw.

## Import

```ts
import { isValidJSON } from "@sgx4u/object";
```

## Signature

```ts
function isValidJSON(text: unknown): boolean;
```

## Behavior

`true` only when `text` is a string and `parseJSON(text)` does not return `undefined`. Non-strings are `false`. JSON that contains a dangerous key is still valid text; `parseJSON` drops those keys and returns an object.

## Examples

```ts
isValidJSON('{"id":1}'); // true
isValidJSON("{"); // false
isValidJSON(null); // false
```

## Edge cases

| Value                                                 | Result  |
| ----------------------------------------------------- | ------- |
| `"null"`, `"0"`, `"[]"`, `"{}"`                       | `true`  |
| `""`, `"undefined"`, `"{"`                            | `false` |
| A number, `null`, `undefined`, an object, or an array | `false` |
