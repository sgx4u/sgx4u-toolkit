# `isSingular`

Reports whether a word is an English singular. Uncountable words are singular as well as plural.

## Import

```ts
import { isSingular } from "@sgx4u/string";
```

## Signature

```ts
function isSingular(value: unknown): boolean;
```

## Examples

```ts
isSingular("cat");
```

## Edge cases

`cats` returns `false`. `sheep` returns `true`.
