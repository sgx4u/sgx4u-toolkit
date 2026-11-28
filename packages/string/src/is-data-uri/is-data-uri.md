# `isDataURI`

Reports whether a string is a `data:` URI.

## Import

```ts
import { isDataURI } from "@sgx4u/string";
```

## Signature

```ts
function isDataURI(value: unknown): boolean;
```

## Examples

```ts
isDataURI("value");
```

## Edge cases

A non-string returns `false`.
