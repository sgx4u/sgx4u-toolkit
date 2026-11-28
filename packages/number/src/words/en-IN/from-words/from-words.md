# `fromWords`

Parses cardinal or ordinal words from this locale. Text that is not a number in words returns `undefined`.

Supported range: Indian English, thousand through shankh (below 10^19).

## Import

```ts
import { fromWords } from "@sgx4u/number/words/en-IN";
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
