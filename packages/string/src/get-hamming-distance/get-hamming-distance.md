# `getHammingDistance`

The number of differing units, or `undefined` when the lengths differ.

## Import

```ts
import { getHammingDistance } from "@sgx4u/string";
```

## Signature

```ts
function getHammingDistance(options: {
    first: string;
    second: string;
}): number | undefined;
```

## Examples

```ts
getHammingDistance({ first: "kitten", second: "sitting" });
```

## Edge cases

A non-string returns `undefined`.
