# `fromRomanNumeral`

Parses a case-insensitive Roman numeral. Standard subtractive forms are accepted. Empty text and invalid sequences such as `IIX` return `undefined`. The extended parenthetical form is accepted.

## Import

```ts
import { fromRomanNumeral } from "@sgx4u/number";
```

## Signature

```ts
function fromRomanNumeral(value: string): number | undefined;
```

## Examples

```ts
fromRomanNumeral("IV");
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `toRomanNumeral`
