# `getNextAnniversary`

Returns the start of the next anniversary of a date.

## Import

```ts
import { getNextAnniversary } from "@sgx4u/date-time";
```

## Signature

```ts
function getNextAnniversary(
    date: DateInput,
    options?: NextAnniversaryOptions,
): Date;
```

## Options

| Name                           | Type                         | Default                                 | Meaning                                                              |
| ------------------------------ | ---------------------------- | --------------------------------------- | -------------------------------------------------------------------- |
| `now`                          | `DateInput`                  | `Date.now()`, read on each call         | The instant to use instead of the current time.                      |
| `timeZone`                     | `string`                     | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`. |
| `leapDayBirthdayInCommonYears` | `"february-28" \| "march-1"` | `"march-1"`                             | Where a February 29 anniversary falls in a common year.              |
| `includeToday`                 | `boolean`                    | `true`                                  | Whether today's anniversary counts as the next one.                  |

## Examples

```ts
import { getNextAnniversary } from "@sgx4u/date-time";

getNextAnniversary("2000-02-29", {
    now: "2021-03-01T12:00:00Z",
    timeZone: "UTC",
}).toISOString();
// "2021-03-01T00:00:00.000Z"

getNextAnniversary("2000-02-29", {
    now: "2021-03-01T12:00:00Z",
    timeZone: "UTC",
    includeToday: false,
}).toISOString();
// "2022-03-01T00:00:00.000Z"

getNextAnniversary("2000-06-15", {
    now: "2026-06-16T00:00:00Z",
    timeZone: "UTC",
}).toISOString();
// "2027-06-15T00:00:00.000Z"
```

## Edge cases

When today is the anniversary and `includeToday` is `true`, the result is the start of today. `false` moves to the following year. A February 29 date uses `leapDayBirthdayInCommonYears`. The result is the start of that calendar day in `timeZone`.

## Related

- [`getAge`](../get-age/get-age.md)
- [`getAgeAsDuration`](../get-age-as-duration/get-age-as-duration.md)
- [`isLeapYear`](../is-leap-year/is-leap-year.md)
