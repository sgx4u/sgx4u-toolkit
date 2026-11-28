# `isPort`

Reports whether a string is a TCP port from 0 through 65535, with no leading zeros except the number 0.

## Import

```ts
import { isPort } from "@sgx4u/string";
```

## Signature

```ts
function isPort(value: unknown): boolean;
```

## Examples

```ts
isPort("value");
```

## Edge cases

A non-string returns `false`.
