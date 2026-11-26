# `getAge`

Returns the number of completed years since a birth date.

## Import

```ts
import { getAge } from "@sgx4u/date-time";
```

## Signature

```ts
function getAge(params: GetAgeParams): number | undefined;
```

## Options

| Name                           | Type                         | Required | Default                                 | Meaning                                                              |
| ------------------------------ | ---------------------------- | -------- | --------------------------------------- | -------------------------------------------------------------------- |
| `birthDate`                    | `DateInput`                  | Yes      | —                                       | Start of the age.                                                    |
| `now`                          | `DateInput`                  | No       | `Date.now()`, read on each call         | The instant to use instead of the current time.                      |
| `timeZone`                     | `string`                     | No       | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`. |
| `leapDayBirthdayInCommonYears` | `"february-28" \| "march-1"` | No       | `"march-1"`                             | Where a February 29 birthday is reached in a common year.            |

## Examples

```ts
import { getAge } from "@sgx4u/date-time";

getAge("2000-02-29", { now: "2021-03-01T00:00:00Z", timeZone: "UTC" });
// 21

getAge("2000-02-29", {
    now: "2021-02-28T00:00:00Z",
    timeZone: "UTC",
    leapDayBirthdayInCommonYears: "february-28",
});
// 21

getAge("2000-06-15", { now: "2026-06-14T00:00:00Z", timeZone: "UTC" });
// 25

getAge("2000-06-15", { now: "2026-06-15T00:00:00Z", timeZone: "UTC" });
// 26
```

## Edge cases

Invalid `birthDate`, `now`, or a birth after `now` returns `undefined`. Unknown `leapDayBirthdayInCommonYears` or an invalid `timeZone` throws.


## Related

- [`getAgeAsDuration`](../get-age-as-duration/get-age-as-duration.md)
- [`getNextAnniversary`](../get-next-anniversary/get-next-anniversary.md)
- [`isLeapYear`](../is-leap-year/is-leap-year.md)
