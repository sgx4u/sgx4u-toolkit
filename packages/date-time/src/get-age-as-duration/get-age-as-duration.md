# `getAgeAsDuration`

Returns an age as years, months, and days.

## Import

```ts
import { getAgeAsDuration } from "@sgx4u/date-time";
```

## Signature

```ts
function getAgeAsDuration(params: GetAgeParams): Duration | undefined;
```

## Parameters

| Name                           | Type              | Required | Default                                  | Meaning                                                   |
| ------------------------------ | ----------------- | -------- | ---------------------------------------- | --------------------------------------------------------- |
| `birthDate`                    | `DateInput`       | yes      |                                          | The start of the age.                                     |
| `leapDayBirthdayInCommonYears` | `LeapDayBirthday` | no       | `"march-1"`                              | Where a February 29 birthday is reached in a common year. |
| `now`                          | `DateInput`       | no       | `Date.now()`, read on each call.         | The instant to use instead of the current time.           |
| `timeZone`                     | `string`          | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset        |

## Examples

```ts
import { getAgeAsDuration } from "@sgx4u/date-time";

getAgeAsDuration({
    birthDate: "2020-01-31",
    now: "2021-03-01T00:00:00Z",
    timeZone: "UTC",
});
// { years: 1, months: 1, days: 1 }

getAgeAsDuration({
    birthDate: "2020-01-31",
    now: "2020-01-31T12:00:00Z",
    timeZone: "UTC",
});
// {  }

getAgeAsDuration({
    birthDate: "2000-02-29",
    now: "2021-02-28T00:00:00Z",
    timeZone: "UTC",
    leapDayBirthdayInCommonYears: "february-28",
});
// { years: 21 }
```

## Edge cases

Invalid inputs return `undefined`, as for `getAge`. Unknown `leapDayBirthdayInCommonYears` or an invalid `timeZone` throws.

## Related

- [`getAge`](../get-age/get-age.md)
- [`getNextAnniversary`](../get-next-anniversary/get-next-anniversary.md)
- [`negateDuration`](../negate-duration/negate-duration.md)
