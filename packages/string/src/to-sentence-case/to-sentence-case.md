# `toSentenceCase`

Converts text to sentence case.

## Import

```ts
import { toSentenceCase } from "@sgx4u/string";
```

## Signature

```ts
function toSentenceCase(value: string): string | undefined;
```

## Examples

```ts
toSentenceCase("fooBar");
```

## Edge cases

A non-string returns `undefined`.
