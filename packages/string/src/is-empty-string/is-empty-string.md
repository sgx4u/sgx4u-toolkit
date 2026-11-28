# `isEmptyString`

Reports whether `value` is exactly the empty string.

## Import

```ts
import { isEmptyString } from "@sgx4u/string";
```

## Signature

```ts
function isEmptyString(value: unknown): boolean;
```

## Examples

```ts
isEmptyString("");
```

## Edge cases

Whitespace returns `false`. Only `""` returns `true`.
