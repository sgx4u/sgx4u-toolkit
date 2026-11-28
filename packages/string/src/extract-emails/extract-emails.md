# `extractEmails`

Extracts email-shaped spans in order. A non-string returns `undefined`.

## Import

```ts
import { extractEmails } from "@sgx4u/string";
```

## Signature

```ts
function extractEmails(value: unknown): string[] | undefined;
```

## Examples

```ts
extractEmails("a@b.co");
```

## Edge cases

An empty result is `[]`, not `undefined`.
