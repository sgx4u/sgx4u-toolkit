# `splitWords`

Splits text into words on separators and camel-case boundaries. `XMLHttpRequest` is `XML`, `Http`, `Request`. `mergeAmbiguousCharacters` turns `V1.2` into `V12`.

## Import

```ts
import { splitWords } from "@sgx4u/string";
```

## Signature

```ts
function splitWords(value: string): string[] | undefined;
```

## Examples

```ts
splitWords("fooBar");
```

## Edge cases

An empty string returns `[]`. A non-string returns `undefined`.
