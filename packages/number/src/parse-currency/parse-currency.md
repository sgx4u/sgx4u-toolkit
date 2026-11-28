# `parseCurrency`

Strips a locale currency symbol or code, then parses the remaining locale number.

## Import

```ts
import { parseCurrency } from "@sgx4u/number";
```

## Signature

```ts
function parseCurrency(parameters: {
    value: string;
    locale?: string | readonly string[];
    currency?: string;
}): number | undefined;
```

## Examples

```ts
parseCurrency({ value: "₹1,00,000", locale: "en-IN", currency: "INR" });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `parseLocaleNumber`
- `formatCurrency`
