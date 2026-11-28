# `getJaroWinklerSimilarity`

Returns the Jaro-Winkler similarity from 0 to 1. Equal strings score 1.

## Import

```ts
import { getJaroWinklerSimilarity } from "@sgx4u/string";
```

## Signature

```ts
function getJaroWinklerSimilarity(options: {
    first: string;
    second: string;
}): number | undefined;
```

## Examples

```ts
getJaroWinklerSimilarity({ first: "martha", second: "marhta" });
```

## Edge cases

Two empty strings score 1.
