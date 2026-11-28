# `capitalize`

Uppercases the first grapheme. The rest is lowercased unless `restToLowerCase` is false.

## Import

```ts
import { capitalize } from "@sgx4u/string";
```

## Signature

```ts
function capitalize(value: string): string | undefined;
```

## Examples

```ts
capitalize("hello");
```

## Edge cases

An empty string stays empty. The first grapheme of an emoji string is the emoji.
