# `decodeBase64URL`

Decodes base64url. Invalid text returns `undefined`.

## Import

```ts
import { decodeBase64URL } from "@sgx4u/string";
```

## Signature

```ts
function decodeBase64URL(value: unknown): string | undefined;
```

## Examples

```ts
decodeBase64URL("aGk");
```

## Edge cases

Standard `+` and `/` are rejected.
