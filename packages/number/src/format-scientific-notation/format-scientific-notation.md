# `formatScientificNotation`

Formats a finite number in scientific notation.

## Import

```ts
import { formatScientificNotation } from "@sgx4u/number";
```

## Signature

```ts
function formatScientificNotation(parameters: {
    value: number;
    locale?: string | readonly string[];
    maximumSignificantDigits?: number;
}): string | undefined;
```

## Examples

```ts
formatScientificNotation({ value: 12345, locale: "en-US" });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `formatEngineeringNotation`
