# `getEasterSunday`

Returns Easter Sunday as a Gregorian calendar date.

## Import

```ts
import { getEasterSunday } from "@sgx4u/date-time";
```

## Signature

```ts
function getEasterSunday(year: number, options?: EasterOptions): CalendarDate;
```

## Options

| Name        | Type                      | Default     | Meaning                                                                                                             |
| ----------- | ------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------- |
| `tradition` | `"western" \| "orthodox"` | `"western"` | Western Easter uses the Gregorian computus. Orthodox Easter uses the Julian computus converted to a Gregorian date. |

## Examples

```ts
import { getEasterSunday } from "@sgx4u/date-time";

getEasterSunday(2026);
// { year: 2026, month: 4, day: 5 }

getEasterSunday(2026, { tradition: "orthodox" });
// { year: 2026, month: 4, day: 12 }

getEasterSunday(2024);
// { year: 2024, month: 3, day: 31 }
```

## Edge cases

The year must be an integer from 1583 through 9999. An unknown `tradition` throws a `RangeError`. The result is a calendar date, not an instant.

## Related

- [`getObservedDate`](../get-observed-date/get-observed-date.md)
- [`getHoliday`](../get-holiday/get-holiday.md)
- [`getHolidaysInYear`](../get-holidays-in-year/get-holidays-in-year.md)
