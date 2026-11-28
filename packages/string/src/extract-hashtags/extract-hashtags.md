# `extractHashtags`

Extracts hashtags of `#` plus letters or digits.

## Import

```ts
import { extractHashtags } from "@sgx4u/string";
```

## Signature

```ts
function extractHashtags(value: unknown): string[] | undefined;
```

## Examples

```ts
extractHashtags("#Hello");
```

## Edge cases

No matches returns an empty array.
