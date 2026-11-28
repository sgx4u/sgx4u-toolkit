# `canonicalizeJSON`

Serializes a value with RFC 8785 JSON Canonicalization Scheme. Object keys are sorted by UTF-16 code units, which is JavaScript's default string sort. The text has no whitespace. A value that is not JSON returns `undefined`. The function does not throw.

## Import

```ts
import { canonicalizeJSON } from "@sgx4u/object/hash";
```

## Signature

```ts
function canonicalizeJSON(value: unknown): string | undefined;
```

Strings and finite numbers use `JSON.stringify`. `JSON.stringify(-0)` is `"0"`, so `-0` becomes `0`. Arrays keep their order and are joined with commas.

## What is rejected

`undefined` is returned for a cycle, an array hole, `undefined`, a function, a symbol, a bigint, `NaN`, an infinity, a symbol key, or an object that is not a plain object or an array. `toJSON` is not called. `undefined` object properties are not dropped; they make the whole value non-JSON. A shared reference that is not a cycle is written again at each location.

This is narrower than `JSON.stringify`, which omits `undefined` object properties and writes `null` for array holes.

## Examples

```ts
canonicalizeJSON({ b: 1, a: 2 }); // '{"a":2,"b":1}'
canonicalizeJSON(-0); // "0"
canonicalizeJSON([true, null, "a"]); // '[true,null,"a"]'
canonicalizeJSON(Number.NaN); // undefined
canonicalizeJSON({ a: undefined }); // undefined
```

## Edge cases

| Value                                        | Result                     |
| -------------------------------------------- | -------------------------- |
| `{}` and `[]`                                | `"{}"` and `"[]"`          |
| `{ A: 3, a: 2, b: 1 }`                       | `'{"A":3,"a":2,"b":1}'`    |
| the same child stored on two keys            | the child text is repeated |
| a cycle                                      | `undefined`                |
| a `Date`, `Map`, function, bigint, or symbol | `undefined`                |
| an array hole                                | `undefined`                |
