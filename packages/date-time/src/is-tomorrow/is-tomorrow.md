# `isTomorrow`

Reports whether a date falls on the calendar day after today.

## Import

```ts
import { isTomorrow } from "@sgx4u/date-time";
```

## Signature

```ts
function isTomorrow(
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
import { isTomorrow } from "@sgx4u/date-time";

isTomorrow("2026-11-27T00:00:00Z", {
    now: "2026-11-26T00:00:00Z",
    timeZone: "UTC",
});
// true

isTomorrow("2026-11-27T20:00:00Z", {
    now: "2026-11-26T20:00:00Z",
    timeZone: "Asia/Kolkata",
});
// true

isTomorrow("2026-11-26T20:00:00Z", {
    now: "2026-11-26T20:00:00Z",
    timeZone: "Asia/Kolkata",
});
// false
```

## Edge cases

Tomorrow is the next calendar day in `timeZone`, not a 24-hour offset. An instant equal to `now` is today, not tomorrow. A value that is not a real date throws a `RangeError`.

## Related

- [`isToday`](../is-today/is-today.md)
- [`isYesterday`](../is-yesterday/is-yesterday.md)
- [`isWithinNext`](../is-within-next/is-within-next.md)
