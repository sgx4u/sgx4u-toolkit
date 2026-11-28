# `collapseWhitespace`

Collapses each Unicode whitespace run to one space and trims the ends.

## Import

```ts
import { collapseWhitespace } from "@sgx4u/string";
```

## Signature

```ts
function collapseWhitespace(value: unknown): string | undefined;
```

## Examples

```ts
collapseWhitespace("  a   b  ");
```

## Edge cases

A non-string returns `undefined`.
