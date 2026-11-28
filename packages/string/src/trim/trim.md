# `trim`

Trims Unicode whitespace, or a set of graphemes, from both ends. `trimStart` and `trimEnd` trim one end.

## Import

```ts
import { trim } from "@sgx4u/string";
```

## Signature

```ts
function trim(value: string): string | undefined;
```

## Examples

```ts
trim("  hello  ");
```

## Edge cases

A non-breaking space is whitespace. A non-string returns `undefined`.
