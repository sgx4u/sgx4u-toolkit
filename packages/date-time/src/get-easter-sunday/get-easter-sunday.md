# `getEasterSunday`

Returns Easter Sunday as a Gregorian calendar date.

## Import

```ts
import { getEasterSunday } from "@sgx4u/date-time";
```

## Signature

```ts
function getEasterSunday(
    params: GetEasterSundayParams,
): CalendarDate | undefined;
```

## Parameters

| Name        | Type                      | Required | Default     | Meaning                                                              |
| ----------- | ------------------------- | -------- | ----------- | -------------------------------------------------------------------- |
| `year`      | `number`                  | yes      |             | The Gregorian year.                                                  |
| `tradition` | `"western" \| "orthodox"` | no       | `"western"` | Western Easter uses the Gregorian computus. Orthodox Easter uses the |

## Examples

```ts
import { getEasterSunday } from "@sgx4u/date-time";

getEasterSunday({ year: 2026 });
// { year: 2026, month: 4, day: 5 }

getEasterSunday({ year: 2026, tradition: "orthodox" });
// { year: 2026, month: 4, day: 12 }

getEasterSunday({ year: 2024 });
// { year: 2024, month: 3, day: 31 }
```

## Edge cases

A non-integer year or a year outside 1583 through 9999 returns `undefined`. An unknown `tradition` throws.

## Related

- [`getObservedDate`](../get-observed-date/get-observed-date.md)
- [`getHoliday`](../get-holiday/get-holiday.md)
- [`getHolidaysInYear`](../get-holidays-in-year/get-holidays-in-year.md)
