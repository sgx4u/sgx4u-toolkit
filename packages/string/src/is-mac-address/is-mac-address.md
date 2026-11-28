# `isMACAddress`

Reports whether a string is a MAC address in colon, hyphen, Cisco dot, or bare form.

## Import

```ts
import { isMACAddress } from "@sgx4u/string";
```

## Signature

```ts
function isMACAddress(value: unknown): boolean;
```

## Examples

```ts
isMACAddress("value");
```

## Edge cases

A non-string returns `false`.
