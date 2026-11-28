# `toRomanNumeral`

Converts an integer to a Roman numeral. Standard numerals cover 1 to 3999. `style: "extended"` covers 1 to 3999999 using parentheses for thousands, so 4000 is `(IV)`.

## Import

```ts
import { toRomanNumeral } from "@sgx4u/number";
```

## Signature

```ts
function toRomanNumeral(parameters: {
    value: number;
    style?: "standard" | "extended";
}): string | undefined;
```

## Examples

```ts
toRomanNumeral({ value: 4 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `fromRomanNumeral`
