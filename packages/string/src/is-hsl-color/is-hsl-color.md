# `isHSLColor`

Reports whether a string is a CSS `hsl()` or `hsla()` color.

## Import

```ts
import { isHSLColor } from "@sgx4u/string";
```

## Signature

```ts
function isHSLColor(value: unknown): boolean;
```

## Examples

```ts
isHSLColor("value");
```

## Edge cases

A non-string returns `false`.
