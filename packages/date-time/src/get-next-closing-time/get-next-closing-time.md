# `getNextClosingTime`

Returns the next time a weekly schedule closes.

## Import

```ts
import { getNextClosingTime } from "@sgx4u/date-time";
```

## Signature

```ts
function getNextClosingTime(
    date: DateInput,
    schedule: WeeklySchedule,
    options?: TimeZoneOptions,
): Date | undefined;
```

## Options

| Name       | Type     | Default                                 | Meaning                                                              |
| ---------- | -------- | --------------------------------------- | -------------------------------------------------------------------- |
| `timeZone` | `string` | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`. |

## Examples

```ts
import { getNextClosingTime } from "@sgx4u/date-time";

getNextClosingTime(
    "2026-11-26T12:00:00Z",
    { hours: { 4: [{ start: "09:00", end: "17:00" }] } },
    { timeZone: "UTC" },
)?.toISOString();
// "2026-11-26T17:00:00.000Z"

getNextClosingTime(
    "2026-11-26T08:00:00Z",
    { hours: { 4: [{ start: "09:00", end: "17:00" }] } },
    { timeZone: "UTC" },
)?.toISOString();
// "2026-11-26T17:00:00.000Z"

getNextClosingTime(
    "2026-11-26T18:00:00Z",
    { hours: { 4: [{ start: "09:00", end: "17:00" }] } },
    { timeZone: "UTC" },
)?.toISOString();
// "2026-12-03T17:00:00.000Z"
```

## Edge cases

Weekday keys are ISO numbers, so `4` is Thursday. When the instant is open, the result is the end of the current open interval. When it is closed, the result is the end of the next open interval. The search stops after 400 days and returns `undefined` when the schedule does not close. A range whose end is not after its start continues past midnight.

## Related

- [`getNextOpeningTime`](../get-next-opening-time/get-next-opening-time.md)
- [`isOpenAt`](../is-open-at/is-open-at.md)
- [`isWithinBusinessHours`](../is-within-business-hours/is-within-business-hours.md)
