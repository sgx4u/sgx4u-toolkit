# `getPluralCategory`

Returns the `Intl.PluralRules` category. A count that is not a finite number returns `undefined`.

## Import

```ts
import { getPluralCategory } from "@sgx4u/string";
```

## Signature

```ts
function getPluralCategory(options: {
    count: number;
    locale?: string;
    type?: "cardinal" | "ordinal";
}): string | undefined;
```

## Examples

```ts
getPluralCategory({ count: 1, locale: "en" });
```

## Edge cases

`NaN` returns `undefined` and does not throw.
