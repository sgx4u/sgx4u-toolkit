# `getSimilarity`

Returns a similarity from 0 to 1. The default algorithm is Jaro-Winkler.

## Import

```ts
import { getSimilarity } from "@sgx4u/string";
```

## Signature

```ts
function getSimilarity(options: {
    first: string;
    second: string;
    algorithm?: "jaro-winkler" | "dice" | "normalized-levenshtein";
}): number | undefined;
```

## Examples

```ts
getSimilarity({ first: "abc", second: "abc" });
```

## Edge cases

An unknown algorithm throws `RangeError`.
