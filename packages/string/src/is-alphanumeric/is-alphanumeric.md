# `isAlphanumeric`

Reports whether every grapheme is a letter or a decimal digit. The locale rule matches `isAlpha`.

## Import

```ts
import { isAlphanumeric } from "@sgx4u/string";
```

## Signature

```ts
function isAlphanumeric(value: unknown): boolean;
```

## Examples

```ts
isAlphanumeric("abc123");
```

## Edge cases

An empty string returns `false`.
