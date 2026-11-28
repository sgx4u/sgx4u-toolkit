# `extractMentions`

Extracts mentions of `@` plus letters, digits, and underscore.

## Import

```ts
import { extractMentions } from "@sgx4u/string";
```

## Signature

```ts
function extractMentions(value: unknown): string[] | undefined;
```

## Examples

```ts
extractMentions("hi @ada");
```

## Edge cases

No matches returns an empty array.
