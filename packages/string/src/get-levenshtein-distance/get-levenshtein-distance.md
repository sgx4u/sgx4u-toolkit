# `getLevenshteinDistance`

The edit distance.

## Import

```ts
import { getLevenshteinDistance } from "@sgx4u/string";
```

## Signature

```ts
function getLevenshteinDistance(options: {
    first: string;
    second: string;
}): number | undefined;
```

## Examples

```ts
getLevenshteinDistance({ first: "kitten", second: "sitting" });
```

## Edge cases

A non-string returns `undefined`.
