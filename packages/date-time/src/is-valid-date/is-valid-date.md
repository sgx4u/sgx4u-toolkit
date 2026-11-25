# `isValidDate`

Reports whether a value is a real date. A valid result is a `Date` with a finite time value, a millisecond timestamp `Date` can store, or a date string whose calendar day exists. The function returns `false` for ordinary invalid input and does not throw.

## Import

```ts
import { isValidDate, type DateInput } from "@sgx4u/date-time";
```

## Signature

```ts
function isValidDate(value: unknown): boolean;
```

`DateInput` is `Date | number | string`. It names the three kinds the function can accept. A value of that type can still be invalid: `new Date(Number.NaN)` and `"2024-02-30"` are both `DateInput` values, and both return `false`. The parameter is `unknown`, so `null`, `undefined`, and other values are accepted by the type checker and return `false`.

## Accepted inputs

### `Date`

Valid when `getTime()` returns a finite number. `Invalid Date` returns `false`. A subclass of `Date` uses the same rule.

A `Date` built from an overflow string is valid when that construction produced a finite instant. `new Date("2024-02-30")` is a March instant in JavaScript, so `isValidDate` returns `true` for the object. The string `"2024-02-30"` returns `false`.

A `Date` created in another realm, such as another window, is recognized. The check uses `Object.prototype.toString`, then requires a finite time value.

### `number`

A Unix timestamp in milliseconds. Valid from `-8640000000000000` through `8640000000000000`. `NaN` and infinities return `false`. A fractional millisecond returns `true` when `Date` can store a finite instant for it.

### `string`

No leading or trailing whitespace. A numeric string such as `"1700000000000"` is not a timestamp.

A calendar date uses `YYYY-MM-DD`. The year is four digits, from `0000` through `9999`. The month and day must exist in the proleptic Gregorian calendar. February 29 is valid in a leap year. A year divisible by 100 is a leap year only when it is also divisible by 400. Year `0000` is a leap year. `2024-02-30` is invalid. The day is not moved into March.

A date-time uses this shape:

```text
YYYY-MM-DDTHH:mm[:ss[.sss]](Z|±HH:mm|±HHmm)
```

- `T` and `Z` may be lowercase.
- The hour is `00`–`23`. `24:00` is invalid.
- The minute and second are `00`–`59`. A leap second is invalid.
- Fractional seconds, when present, are one, two, or three digits.
- The offset is required. `Z` is valid. `±HH:mm` and `±HHmm` are valid when the hours are `00`–`23` and the minutes are `00`–`59`. `±HH` without minutes is not a date-string offset.
- A date-time with no offset is invalid, so the result does not depend on the local timezone.

## Examples

```ts
isValidDate(new Date("2024-02-29T00:00:00.000Z")); // true
isValidDate(0); // true
isValidDate("2024-02-29"); // true
isValidDate("2024-02-29T00:00:00+05:30"); // true
isValidDate("2024-02-29T00:00:00+0530"); // true

isValidDate("2024-02-30"); // false
isValidDate(new Date(Number.NaN)); // false
isValidDate(Number.NaN); // false
isValidDate(""); // false
isValidDate(null); // false
```

## Edge cases

| Value                                                     | Result                                    |
| --------------------------------------------------------- | ----------------------------------------- |
| `new Date(Number.NaN)`, `new Date("")`                    | `false`                                   |
| `NaN`, `Infinity`, a timestamp outside ±8.64e15           | `false`                                   |
| `null`, `undefined`, `""`, `"   "`                        | `false`                                   |
| `{}`, `[]`, a boolean, a bigint, a symbol, a function     | `false`                                   |
| `"2024-02-30"`, `"2023-02-29"`, `"2024-04-31"`            | `false`                                   |
| `"2024-02-29T24:00:00Z"`, `"2024-02-29T23:59:60Z"`        | `false`                                   |
| `"2024-02-29T00:00:00"` with no offset                    | `false`                                   |
| `"2024-02-29 00:00:00Z"` with a space                     | `false`                                   |
| `"2024-02-29T00:00:00+0530"` without a colon              | `true`                                    |
| `"2024-02-29T00:00:00+05"` with hours only                | `false`                                   |
| `"2024-2-29"` without zero padding                        | `false`                                   |
| `"2024-02-29T00:00:00.1234Z"` with four fractional digits | `false`                                   |
| `"1700000000000"`                                         | `false`. Pass the number `1700000000000`. |

`Date.parse` accepts some of these strings. `Date.parse("2024-02-30")` returns a timestamp in March, `Date.parse("2024-2-29")` accepts an unpadded month, and `Date.parse("2024-02-29T24:00:00Z")` rolls into the next day. `isValidDate` returns `false` for each of those strings.
