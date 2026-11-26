# `isHoliday`

Reports whether a calendar day is in a holiday list.

## Import

```ts
import { isHoliday } from "@sgx4u/date-time";
```

## Signature

```ts
function isHoliday(params: IsHolidayParams & { includeName?: false }): boolean;
function isHoliday(
    params: IsHolidayParams & { includeName: true },
): HolidayCheck;
```

## Options

| Name          | Type                                          | Required | Default     | Meaning                                             |
| ------------- | --------------------------------------------- | -------- | ----------- | --------------------------------------------------- |
| `date`        | `DateInput`                                   | yes      |             | The instant to test.                                |
| `holidays`    | `readonly (ConfiguredHoliday \| DateInput)[]` | no       | `[]`        | Holidays to match.                                  |
| `timeZone`    | `string`                                      | no       | System zone | Zone for the calendar day.                          |
| `includeName` | `boolean`                                     | no       | `false`     | Return `{ isHoliday, name? }` instead of a boolean. |

`ConfiguredHoliday` is `{ date: DateInput; name?: string }`. A date-only string is that calendar day in `timeZone`.

## Examples

```ts
isHoliday({
    date: "2026-01-26",
    holidays: [{ date: "2026-01-26", name: "Republic Day" }],
    timeZone: "Asia/Kolkata",
});
// true

isHoliday({
    date: "2026-01-26",
    holidays: [{ date: "2026-01-26", name: "Republic Day" }],
    timeZone: "Asia/Kolkata",
    includeName: true,
});
// { isHoliday: true, name: "Republic Day" }
```

## Edge cases

A date that is not real returns `false`, or `{ isHoliday: false }` when `includeName` is true. The first matching entry wins. An entry with no name omits `name`. An unusable `timeZone` throws `RangeError`. `holidays` must be an array.

## Related

- [`isBusinessDay`](../is-business-day/is-business-day.md)
- [`indiaHolidays`](../holidays/india-holidays/india-holidays.md)
