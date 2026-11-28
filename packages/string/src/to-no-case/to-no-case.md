# `toNoCase`

Converts text to space-separated lower case.

## Import

```ts
import { toNoCase } from "@sgx4u/string";
```

## Signature

```ts
function toNoCase(value: string): string | undefined;
```

## Examples

```ts
toNoCase("fooBar");
```

## Edge cases

A non-string returns `undefined`.
