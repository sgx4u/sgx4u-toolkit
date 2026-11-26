# `isValidDate`

Reports whether a value is a real date.

## Import

```ts
import { isValidDate } from "@sgx4u/date-time";
```

## Signature

```ts
function isValidDate(value: unknown): boolean;
```

## Options

This function has no options.

## Examples

```ts
import { isValidDate } from "@sgx4u/date-time";

isValidDate("2024-02-29T00:00:00+0530");
// true

isValidDate("2024-02-30");
// false

isValidDate(new Date(NaN));
// false

isValidDate(0);
// true
```

## Edge cases

A `Date` is valid when its time value is finite. A number is Unix time in milliseconds and is valid from `-8640000000000000` through `8640000000000000`. A string is valid when it is a real `YYYY-MM-DD` date, or a date-time with an explicit `Z`, `±HH:mm`, or `±HHmm` offset. Ordinary invalid input returns `false`. The function does not throw for those values.

## Related

- [`isDate`](../is-date/is-date.md)
- [`isValidTimeZone`](../is-valid-time-zone/is-valid-time-zone.md)
- [`isSameInstant`](../is-same-instant/is-same-instant.md)
