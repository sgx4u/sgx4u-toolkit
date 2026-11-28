# `isMailtoURI`

Reports whether a string is a `mailto:` URI with an address.

## Import

```ts
import { isMailtoURI } from "@sgx4u/string";
```

## Signature

```ts
function isMailtoURI(value: unknown): boolean;
```

## Examples

```ts
isMailtoURI("value");
```

## Edge cases

A non-string returns `false`.
