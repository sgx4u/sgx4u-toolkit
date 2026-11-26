# `isDaylightSavingTime`

Reports whether an instant is in daylight saving time.

## Import

```ts
import { isDaylightSavingTime } from "@sgx4u/date-time";
```

## Signature

```ts
function isDaylightSavingTime(
    date: DateInput,
    options?: TimeZoneOptions,
): boolean;
```

## Options

| Name       | Type     | Default                                 | Meaning                                                              |
| ---------- | -------- | --------------------------------------- | -------------------------------------------------------------------- |
| `timeZone` | `string` | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`. |

## Examples

```ts
import { isDaylightSavingTime } from "@sgx4u/date-time";

isDaylightSavingTime("2026-01-15T00:00:00Z", {
    timeZone: "America/New_York",
});
// false

isDaylightSavingTime("2026-07-15T00:00:00Z", {
    timeZone: "America/New_York",
});
// true

isDaylightSavingTime("2026-07-15T00:00:00Z", { timeZone: "UTC" });
// false
```

## Edge cases

Daylight saving means the offset is greater than the smaller of the offsets on 1 January and 1 July of that year in the zone. A zone that does not change offset, including UTC, returns `false`. An unknown zone or a value that is not a real date throws a `RangeError`.

## Related

- [`getUTCOffset`](../get-utc-offset/get-utc-offset.md)
- [`getWallTimeStatus`](../get-wall-time-status/get-wall-time-status.md)
- [`getNextTimeZoneTransition`](../get-next-time-zone-transition/get-next-time-zone-transition.md)
