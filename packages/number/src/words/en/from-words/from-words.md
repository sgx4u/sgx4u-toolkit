# `fromWords`

Parses cardinal or ordinal words from this locale. Text that is not a number in words returns `undefined`.

Supported range: international English, thousand through decillion (below 10^36).

## Import

```ts
import { fromWords } from "@sgx4u/number/words/en";
```

## Signature

```ts
function fromWords(parameters: { value: string }): number | undefined;
```

## Examples

```ts
fromWords({ value: "one" });
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
