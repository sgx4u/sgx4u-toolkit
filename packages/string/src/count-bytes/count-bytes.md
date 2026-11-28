# `countBytes`

Returns the UTF-8 byte length of a string.

## Import

```ts
import { countBytes } from "@sgx4u/string";
```

## Signature

```ts
function countBytes(value: unknown): number | undefined;
```

## Examples

```ts
countBytes("é");
```

## Edge cases

A non-string returns `undefined`. An empty string returns 0.
