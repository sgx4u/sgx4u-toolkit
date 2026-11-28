# `createHolidayPredicate`

Builds a holiday predicate that caches each year the first time it is asked.

## Import

```ts
import { createHolidayPredicate } from "@sgx4u/date-time";
```

## Signature

```ts
function createHolidayPredicate(
    params: CreateHolidayPredicateParams,
): (date: Date) => boolean;
```

## Parameters

| Name                | Type                     | Required | Default                                  | Meaning                                                                        |
| ------------------- | ------------------------ | -------- | ---------------------------------------- | ------------------------------------------------------------------------------ |
| `rules`             | `readonly HolidayRule[]` | yes      |                                          | The holiday rules.                                                             |
| `matchObservedDate` | `boolean`                | no       | `true`                                   | Match the observed substitute day. When false, only the original date matches. |
| `timeZone`          | `string`                 | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset                             |

## Examples

```ts
const isIndianHoliday = createHolidayPredicate({
    rules: [
        { name: "Republic Day", date: { kind: "fixed", month: 1, day: 26 } },
    ],
    timeZone: "Asia/Kolkata",
});
isIndianHoliday(new Date("2026-01-25T18:30:00Z")); // true
```

## Edge cases

`rules` that is not an array throws `TypeError`. An unusable `timeZone` throws `RangeError`. The predicate is suitable for `BusinessCalendar.holidays`.

## Related

- [`getHoliday`](../get-holiday/get-holiday.md) looks up one holiday on a date.
- [`isHoliday`](../is-holiday/is-holiday.md) reports whether a date is a holiday.
