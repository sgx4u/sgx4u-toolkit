# `isCapitalized`

Reports whether the first grapheme is an uppercase letter.

## Import

```ts
import { isCapitalized } from "@sgx4u/string";
```

## Signature

```ts
function isCapitalized(value: unknown): boolean;
```

## Examples

```ts
isCapitalized("Hello");
```

## Edge cases

An empty string and a string that starts with a digit return `false`.
