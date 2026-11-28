# `isSlug`

Reports whether a string is a lowercase slug: letters, digits, and single hyphens, with no leading or trailing hyphen.

## Import

```ts
import { isSlug } from "@sgx4u/string";
```

## Signature

```ts
function isSlug(value: unknown): boolean;
```

## Examples

```ts
isSlug("value");
```

## Edge cases

A non-string returns `false`.
