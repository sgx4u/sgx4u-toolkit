# `trimEnd`

Trims one end of a string. See `trim` for the `characters` option.

## Import

```ts
import { trimEnd } from "@sgx4u/string";
```

## Signature

```ts
function trimEnd(value: string): string | undefined;
```

## Examples

```ts
trimEnd("  hello");
```

## Edge cases

A non-string returns `undefined`.
