# `getMillisecondsUntilNextUnit`

Returns the delay until the next unit boundary.

## Import

```ts
import { getMillisecondsUntilNextUnit } from "@sgx4u/date-time";
```

## Signature

```ts
function getMillisecondsUntilNextUnit(
    unit: TimeUnit,
    options?: NowOptions & TimeZoneOptions & WeekOptions,
): number;
```

## Options

| Name           | Type        | Default                                 | Meaning                                                              |
| -------------- | ----------- | --------------------------------------- | -------------------------------------------------------------------- |
| `now`          | `DateInput` | `Date.now()`, read on each call         | The instant to use instead of the current time.                      |
| `timeZone`     | `string`    | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`. |
| `weekStartsOn` | `Weekday`   | `1`                                     | ISO weekday that starts the week. `1` is Monday and `7` is Sunday.   |

## Examples

```ts
import { getMillisecondsUntilNextUnit } from "@sgx4u/date-time";

getMillisecondsUntilNextUnit("hour", {
    now: "2026-01-01T00:00:00Z",
    timeZone: "UTC",
});
// 3600000

getMillisecondsUntilNextUnit("hour", {
    now: "2026-01-01T00:30:00Z",
    timeZone: "UTC",
});
// 1800000

getMillisecondsUntilNextUnit("week", {
    now: "2026-01-01T00:00:00Z",
    timeZone: "UTC",
    weekStartsOn: 1,
});
// 345600000
```

## Edge cases

The result is in `(0, unit length]`. At an exact boundary it is the full length of the following unit, never zero. Weeks start on `weekStartsOn`. An unknown unit throws a `RangeError`.

## Related

- [`getCountdownParts`](../get-countdown-parts/get-countdown-parts.md)
- [`getRelativeTimeParts`](../get-relative-time-parts/get-relative-time-parts.md)
- [`isSameUnit`](../is-same-unit/is-same-unit.md)
