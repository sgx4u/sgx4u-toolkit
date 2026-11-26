# `isWithinNext`

Reports whether a date is between now and now plus a duration.

## Import

```ts
import { isWithinNext } from "@sgx4u/date-time";
```

## Signature

```ts
function isWithinNext(
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
import { isWithinNext } from "@sgx4u/date-time";

isWithinNext(
    "2026-01-01T12:00:00Z",
    { hours: 24 },
    {
        now: "2026-01-01T00:00:00Z",
        timeZone: "UTC",
    },
);
// true

isWithinNext(
    "2026-01-02T00:00:00Z",
    { hours: 24 },
    {
        now: "2026-01-01T00:00:00Z",
        timeZone: "UTC",
    },
);
// true

isWithinNext(
    "2026-01-02T00:00:00.001Z",
    { hours: 24 },
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

- [`isWithinLast`](../is-within-last/is-within-last.md)
- [`isFuture`](../is-future/is-future.md)
- [`isTomorrow`](../is-tomorrow/is-tomorrow.md)
