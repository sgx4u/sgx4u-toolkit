# `getCurrencySymbol`

Returns the currency symbol, narrow symbol, code, or name.

## Import

```ts
import { getCurrencySymbol } from "@sgx4u/number";
```

## Signature

```ts
function getCurrencySymbol(parameters: {
    currency: string;
    locale?: string | readonly string[];
    currencyDisplay?: CurrencyDisplay;
}): string | undefined;
```

## Examples

```ts
getCurrencySymbol({ currency: "USD", locale: "en-US" });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `formatCurrency`
- `parseCurrency`
