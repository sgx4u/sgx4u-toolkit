# `isRGBColor`

Reports whether a string is a CSS `rgb()` or `rgba()` color, including the space and slash forms.

## Import

```ts
import { isRGBColor } from "@sgx4u/string";
```

## Signature

```ts
function isRGBColor(value: unknown): boolean;
```

## Examples

```ts
isRGBColor("value");
```

## Edge cases

A non-string returns `false`.
