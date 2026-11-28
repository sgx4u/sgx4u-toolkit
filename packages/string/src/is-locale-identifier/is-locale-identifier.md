# `isLocaleIdentifier`

Reports whether a string is a well-formed BCP 47 language tag.

## Import

```ts
import { isLocaleIdentifier } from "@sgx4u/string";
```

## Signature

```ts
function isLocaleIdentifier(value: unknown): boolean;
```

## Examples

```ts
isLocaleIdentifier("value");
```

## Edge cases

A non-string returns `false`.
