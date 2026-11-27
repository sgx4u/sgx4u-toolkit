# `getLocaleNumberSymbols`

Returns the decimal, group, sign, percent, infinity, NaN, and exponent characters for a locale.

## Import

```ts
import { getLocaleNumberSymbols } from "@sgx4u/number";
```

## Signature

```ts
function getLocaleNumberSymbols(parameters: {
    locale?: string | readonly string[];
}): LocaleNumberSymbols;
```

## Examples

```ts
getLocaleNumberSymbols({ locale: "de-DE" });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `parseLocaleNumber`
- `formatNumber`
