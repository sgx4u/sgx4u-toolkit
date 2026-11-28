# `isNonEmptyString`

Reports whether `value` is a string with at least one UTF-16 code unit. Whitespace counts as content.

## Import

```ts
import { isNonEmptyString } from "@sgx4u/string";
```

## Signature

```ts
function isNonEmptyString(value: unknown): boolean;
```

## Examples

```ts
isNonEmptyString(" ");
```

## Edge cases

An empty string returns `false`. A string of spaces returns `true`.
