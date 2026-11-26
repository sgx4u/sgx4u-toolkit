# `isWithinLast`

Reports whether a date is between now minus a duration and now.

## Import

```ts
import { isWithinLast } from "@sgx4u/date-time";
```

## Signature

```ts
function isWithinLast(
    date: DateInput,
    duration: Duration,
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
import { isWithinLast } from "@sgx4u/date-time";

isWithinLast(
    "2025-12-31T12:00:00Z",
    { days: 1 },
    {
        now: "2026-01-01T00:00:00Z",
        timeZone: "UTC",
    },
);
// true

isWithinLast(
    "2026-01-01T00:00:00Z",
    { days: 1 },
    {
        now: "2026-01-01T00:00:00Z",
        timeZone: "UTC",
    },
);
// true

isWithinLast(
    "2025-12-30T00:00:00Z",
    { days: 1 },
    {
        now: "2026-01-01T00:00:00Z",
        timeZone: "UTC",
    },
);
// false
```

## Edge cases

Both ends are included. Calendar units in the duration are applied in `timeZone`. A negative duration throws a `RangeError`.

## Related

- [`isWithinNext`](../is-within-next/is-within-next.md)
- [`isPast`](../is-past/is-past.md)
- [`isYesterday`](../is-yesterday/is-yesterday.md)
