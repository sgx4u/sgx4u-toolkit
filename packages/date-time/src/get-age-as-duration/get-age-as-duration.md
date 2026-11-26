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

## Options

Uses the same fields as `getAge`.

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

Invalid inputs return `undefined`, as for `getAge`. Unknown `leapDayBirthdayInCommonYears` or an invalid `timeZone` throws.


## Related

- [`getAge`](../get-age/get-age.md)
- [`getNextAnniversary`](../get-next-anniversary/get-next-anniversary.md)
- [`negateDuration`](../negate-duration/negate-duration.md)
