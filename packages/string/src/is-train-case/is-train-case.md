# `isTrainCase`

Reports whether a non-empty string is unchanged by `toTrainCase`.

## Import

```ts
import { isTrainCase } from "@sgx4u/string";
```

## Signature

```ts
function isTrainCase(value: unknown): boolean;
```

## Examples

```ts
isTrainCase("value");
```

## Edge cases

An empty string and a non-string return `false`.
