# `isMongoObjectId`

Reports whether a string is 24 hexadecimal characters.

## Import

```ts
import { isMongoObjectId } from "@sgx4u/string";
```

## Signature

```ts
function isMongoObjectId(value: unknown): boolean;
```

## Examples

```ts
isMongoObjectId("value");
```

## Edge cases

A non-string returns `false`.
