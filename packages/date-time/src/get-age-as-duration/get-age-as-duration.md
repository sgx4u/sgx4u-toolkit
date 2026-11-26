# `getAgeAsDuration`

Returns an age as years, months, and days.

## Import

```ts
import { getAgeAsDuration } from "@sgx4u/date-time";
```

## Signature

```ts
function getAgeAsDuration(birthDate: DateInput, options?: AgeOptions): Duration;
```

## Options

| Name                           | Type                         | Default                                 | Meaning                                                              |
| ------------------------------ | ---------------------------- | --------------------------------------- | -------------------------------------------------------------------- |
| `now`                          | `DateInput`                  | `Date.now()`, read on each call         | The instant to use instead of the current time.                      |
| `timeZone`                     | `string`                     | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`. |
| `leapDayBirthdayInCommonYears` | `"february-28" \| "march-1"` | `"march-1"`                             | Where a February 29 birthday is reached in a common year.            |

## Examples

```ts
import { getAgeAsDuration } from "@sgx4u/date-time";

getAgeAsDuration("2020-01-31", {
    now: "2021-03-01T00:00:00Z",
    timeZone: "UTC",
});
// { years: 1, months: 1, days: 1 }

getAgeAsDuration("2020-01-31", {
    now: "2020-01-31T12:00:00Z",
    timeZone: "UTC",
});
// {  }

getAgeAsDuration("2000-02-29", {
    now: "2021-02-28T00:00:00Z",
    timeZone: "UTC",
    leapDayBirthdayInCommonYears: "february-28",
});
// { years: 21 }
```

## Edge cases

Zero fields are omitted, so an anniversary that falls on `now` returns `{}`. A February 29 birthday follows the same common-year rule as `getAge`. A birth date after `now` throws a `RangeError`.

## Related

- [`getAge`](../get-age/get-age.md)
- [`getNextAnniversary`](../get-next-anniversary/get-next-anniversary.md)
- [`negateDuration`](../negate-duration/negate-duration.md)
