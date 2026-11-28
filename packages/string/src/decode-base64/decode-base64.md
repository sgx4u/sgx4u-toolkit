# `decodeBase64`

Decodes standard Base64. Invalid text returns `undefined`.

## Import

```ts
import { decodeBase64 } from "@sgx4u/string";
```

## Signature

```ts
function decodeBase64(value: unknown): string | undefined;
```

## Examples

```ts
decodeBase64("aGk=");
```

## Edge cases

`???` returns `undefined`.
