# `findClosestMatch`

Returns the closest candidate. The highest score wins, and an earlier candidate wins a tie.

## Import

```ts
import { findClosestMatch } from "@sgx4u/string";
```

## Signature

```ts
function findClosestMatch(options: {
    value: string;
    candidates: readonly string[];
    minimumScore?: number;
}): ClosestMatch | undefined;
```

## Examples

```ts
findClosestMatch({ value: "cat", candidates: ["car", "dog"] });
```

## Edge cases

An empty candidate list returns `undefined`.
