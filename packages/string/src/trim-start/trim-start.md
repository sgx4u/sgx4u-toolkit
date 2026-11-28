# `trimStart`

Trims one end of a string. See `trim` for the `characters` option.

## Import

```ts
import { trimStart } from "@sgx4u/string";
```

## Signature

```ts
function trimStart(value: string): string | undefined;
```

## Examples

```ts
trimStart("  hello");
```

## Edge cases

A non-string returns `undefined`.
