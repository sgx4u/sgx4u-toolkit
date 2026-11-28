# `extractURLs`

Extracts URLs that `isURL` accepts.

## Import

```ts
import { extractURLs } from "@sgx4u/string";
```

## Signature

```ts
function extractURLs(value: unknown): string[] | undefined;
```

## Examples

```ts
extractURLs("see https://example.com");
```

## Edge cases

A trailing period is not part of the URL.
