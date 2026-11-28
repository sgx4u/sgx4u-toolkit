# `formatEngineeringNotation`

Formats a finite number with an exponent that is a multiple of 3. `maximumSignificantDigits` defaults to 3.

## Import

```ts
import { formatEngineeringNotation } from "@sgx4u/number";
```

## Signature

```ts
function formatEngineeringNotation(parameters: {
    value: number;
    locale?: string | readonly string[];
    maximumSignificantDigits?: number;
}): string | undefined;
```

## Examples

```ts
formatEngineeringNotation({ value: 12345, locale: "en-US" });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `formatScientificNotation`
