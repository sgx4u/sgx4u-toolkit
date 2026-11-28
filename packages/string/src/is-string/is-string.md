# `isString`

Reports whether `value` is a string primitive, including an empty string.

## Import

```ts
import { isString } from "@sgx4u/string";
```

## Signature

```ts
function isString(value: unknown): boolean;
```

## Examples

```ts
isString("hello");
```

## Edge cases

A boxed `String` returns `false`. An empty string returns `true`.
