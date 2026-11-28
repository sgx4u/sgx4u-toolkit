# `isASCII`

Reports whether every code point in `value` is in the range 0 through 127.

## Import

```ts
import { isASCII } from "@sgx4u/string";
```

## Signature

```ts
function isASCII(value: unknown): boolean;
```

## Examples

```ts
isASCII("abc");
```

## Edge cases

An empty string returns `true`. A character above 127 returns `false`.
