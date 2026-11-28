# `isEmail`

Practical email validation for a single address. This is not a full RFC 5322 parser. Comments, quoted strings, and unquoted spaces are rejected even when the RFC allows them.

## Import

```ts
import { isEmail } from "@sgx4u/string";
```

## Signature

```ts
function isEmail(value: unknown): boolean;
```

## Examples

```ts
isEmail("user@example.com");
```

## Edge cases

`user@localhost` is rejected until `requireTopLevelDomain` is false.
