# `findClosestMatches`

Returns the best matches, highest score first. The default limit is 5.

## Import

```ts
import { findClosestMatches } from "@sgx4u/string";
```

## Signature

```ts
function findClosestMatches(options: {
    value: string;
    candidates: readonly string[];
    limit?: number;
}): ClosestMatch[] | undefined;
```

## Examples

```ts
findClosestMatches({ value: "cat", candidates: ["car", "dog"] });
```

## Edge cases

A non-string `value` returns `undefined`.
