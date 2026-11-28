# `maskEmail`

Masks an email local part. `jane@example.com` becomes `j***@example.com`. A string with no `@` returns `undefined`.

## Import

```ts
import { maskEmail } from "@sgx4u/string";
```

## Signature

```ts
function maskEmail(value: string): string | undefined;
```

## Examples

```ts
maskEmail("jane@example.com");
```

## Edge cases

A missing `@` returns `undefined`.
