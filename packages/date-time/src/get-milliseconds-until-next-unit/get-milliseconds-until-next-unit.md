# `getMillisecondsUntilNextUnit`

Returns the delay until the next unit boundary.

## Import

```ts
import { getMillisecondsUntilNextUnit } from "@sgx4u/date-time";
```

## Signature

```ts
function getMillisecondsUntilNextUnit(
    params: GetMillisecondsUntilNextUnitParams,
): number | undefined;
```

## Parameters

| Name           | Type        | Required | Default                                  | Meaning                                                 |
| -------------- | ----------- | -------- | ---------------------------------------- | ------------------------------------------------------- |
| `unit`         | `TimeUnit`  | yes      |                                          | The boundary to wait for.                               |
| `now`          | `DateInput` | no       | `Date.now()`, read on each call.         | The instant to use instead of the current time.         |
| `timeZone`     | `string`    | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset      |
| `weekStartsOn` | `Weekday`   | no       | `1`                                      | ISO weekday number that starts the week. `1` is Monday. |

## Examples

```ts
import { getMillisecondsUntilNextUnit } from "@sgx4u/date-time";

getMillisecondsUntilNextUnit({
    unit: "hour",
    now: "2026-01-01T00:00:00Z",
    timeZone: "UTC",
});
// 3600000

getMillisecondsUntilNextUnit({
    unit: "hour",
    now: "2026-01-01T00:30:00Z",
    timeZone: "UTC",
});
// 1800000

getMillisecondsUntilNextUnit({
    unit: "week",
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
