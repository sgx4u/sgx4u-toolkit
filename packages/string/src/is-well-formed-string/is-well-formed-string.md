# `isWellFormedString`

Reports whether a string is well-formed UTF-16.

## Import

```ts
import { isWellFormedString } from "@sgx4u/string";
```

## Signature

```ts
function isWellFormedString(value: unknown): boolean;
```

## Examples

```ts
isWellFormedString("hello");
```

## Edge cases

A lone surrogate returns `false`. An empty string returns `true`.
