# `isFQDN`

Reports whether a string is a hostname, not a full URL.

## Import

```ts
import { isFQDN } from "@sgx4u/string";
```

## Signature

```ts
function isFQDN(value: unknown): boolean;
```

## Examples

```ts
isFQDN("value");
```

## Edge cases

A non-string returns `false`.
