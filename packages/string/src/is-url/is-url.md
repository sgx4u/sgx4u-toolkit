# `isURL`

Reports whether a string is an allowed URL. The engine is `URL.canParse`. Defaults require `http` or `https`, a protocol, and a top-level domain.

## Import

```ts
import { isURL } from "@sgx4u/string";
```

## Signature

```ts
function isURL(value: unknown): boolean;
```

## Examples

```ts
isURL("https://example.com");
```

## Edge cases

Credentials are rejected unless `allowCredentials` is true. Localhost is rejected unless `allowLocalhost` is true.
