# `isHexColor`

Reports whether a string is a hex color. `#` is optional. Short and alpha forms are allowed by default.

## Import

```ts
import { isHexColor } from "@sgx4u/string";
```

## Signature

```ts
function isHexColor(value: unknown): boolean;
```

## Examples

```ts
isHexColor("value");
```

## Edge cases

A non-string returns `false`.
