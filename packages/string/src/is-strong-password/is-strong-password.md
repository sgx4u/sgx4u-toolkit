# `isStrongPassword`

A password policy check, not a guarantee of strength. Defaults require length 8 and one lowercase, uppercase, number, and symbol.

## Import

```ts
import { isStrongPassword } from "@sgx4u/string";
```

## Signature

```ts
function isStrongPassword(value: unknown): boolean;
```

## Examples

```ts
isStrongPassword("value");
```

## Edge cases

A non-string returns `false`.
