# `isToday`

Reports whether a date falls on today's calendar day in a time zone.

## Import

```ts
import { isToday } from "@sgx4u/date-time";
```

## Signature

```ts
function isToday(
    date: DateInput,
    options?: NowOptions & TimeZoneOptions,
): boolean;
```

## Options

| Name       | Type        | Default                                 | Meaning                                                              |
| ---------- | ----------- | --------------------------------------- | -------------------------------------------------------------------- |
| `now`      | `DateInput` | `Date.now()`, read on each call         | The instant to use instead of the current time.                      |
| `timeZone` | `string`    | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`. |

## Examples

```ts
import { isToday } from "@sgx4u/date-time";

isToday("2026-11-26T23:00:00Z", {
    now: "2026-11-26T01:00:00Z",
    timeZone: "UTC",
});
// true

isToday("2026-11-26T12:00:00Z", {
    now: "2026-11-26T20:00:00Z",
    timeZone: "UTC",
});
// true

isToday("2026-11-26T12:00:00Z", {
    now: "2026-11-26T20:00:00Z",
    timeZone: "Asia/Kolkata",
});
// false
```

## Edge cases

The calendar day is the day in `timeZone`. The same two instants can be the same UTC day and different local days. `now` defaults to the current time. A value that is not a real date throws a `RangeError`.

## Related

- [`isTomorrow`](../is-tomorrow/is-tomorrow.md)
- [`isYesterday`](../is-yesterday/is-yesterday.md)
- [`isSameUnit`](../is-same-unit/is-same-unit.md)
