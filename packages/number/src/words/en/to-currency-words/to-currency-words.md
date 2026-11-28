# `toCurrencyWords`

Spells a currency amount. `USD`, `EUR`, `GBP`, and `INR` have unit names. Another three-letter code uses the code as the major unit and `minor` for the hundredth.

Supported range: international English, thousand through decillion (below 10^36).

## Import

```ts
import { toCurrencyWords } from "@sgx4u/number/words/en";
```

## Signature

```ts
function toCurrencyWords(parameters: {
    value: number;
    currency: string;
    style?: "plain" | "cheque";
}): string | undefined;
```

## Examples

```ts
toCurrencyWords({ value: 1 });
```

## Edge cases

- A non-finite value returns `undefined`.
- More than two decimal places returns `undefined`.
- Negative cheque amounts return `undefined`.

## Related

- `toWords`
- `toOrdinalWords`
- `toCurrencyWords`
- `fromWords`
