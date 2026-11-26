# `isYesterday`

Reports whether a date falls on the calendar day before today.

## Import

```ts
import { isYesterday } from "@sgx4u/date-time";
```

## Signature

```ts
function isYesterday(
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
import { isYesterday } from "@sgx4u/date-time";

isYesterday("2026-11-25T00:00:00Z", {
    now: "2026-11-26T00:00:00Z",
    timeZone: "UTC",
});
// true

isYesterday("2026-11-26T12:00:00Z", {
    now: "2026-11-26T20:00:00Z",
    timeZone: "Asia/Kolkata",
});
// true

isYesterday("2026-11-26T20:00:00Z", {
    now: "2026-11-26T20:00:00Z",
    timeZone: "UTC",
});
// false
```

## Edge cases

Yesterday is the previous calendar day in `timeZone`, not a 24-hour offset. 20:00 UTC on 26 November is already 27 November in Asia/Kolkata, so noon UTC that day is yesterday there. A value that is not a real date throws a `RangeError`.

## Related

- [`isToday`](../is-today/is-today.md)
- [`isTomorrow`](../is-tomorrow/is-tomorrow.md)
- [`isWithinLast`](../is-within-last/is-within-last.md)
