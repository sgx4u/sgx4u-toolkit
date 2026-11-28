# `isPlural`

Reports whether a word is an English plural. Uncountable words such as `sheep` are plural as well as singular.

## Import

```ts
import { isPlural } from "@sgx4u/string";
```

## Signature

```ts
function isPlural(value: unknown): boolean;
```

## Examples

```ts
isPlural("cats");
```

## Edge cases

An empty string returns `false`.
