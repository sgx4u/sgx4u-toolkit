# `getDamerauLevenshteinDistance`

The edit distance, counting an adjacent transposition as one change.

## Import

```ts
import { getDamerauLevenshteinDistance } from "@sgx4u/string";
```

## Signature

```ts
function getDamerauLevenshteinDistance(options: {
    first: string;
    second: string;
}): number | undefined;
```

## Examples

```ts
getDamerauLevenshteinDistance({ first: "kitten", second: "sitting" });
```

## Edge cases

A non-string returns `undefined`.
