# `getNextClosingTime`

Returns the next time a weekly schedule closes.

## Import

```ts
import { getNextClosingTime } from "@sgx4u/date-time";
```

## Signature

```ts
function getNextClosingTime(params: GetNextClosingTimeParams): Date | undefined;
```

## Parameters

| Name       | Type             | Required | Default | Meaning                             |
| ---------- | ---------------- | -------- | ------- | ----------------------------------- |
| `date`     | `DateInput`      | yes      |         | The instant to search from.         |
| `schedule` | `WeeklySchedule` | yes      |         | Weekly hours and optional closures. |
| `timeZone` | `string`         | no       |         | Zone used to read the schedule.     |

## Examples

```ts
import { getNextClosingTime } from "@sgx4u/date-time";

getNextClosingTime({
    date: "2026-11-26T12:00:00Z",
    schedule: { hours: { 4: [{ start: "09:00", end: "17:00" }] } },
    timeZone: "UTC",
})?.toISOString();
// "2026-11-26T17:00:00.000Z"

getNextClosingTime({
    date: "2026-11-26T08:00:00Z",
    schedule: { hours: { 4: [{ start: "09:00", end: "17:00" }] } },
    timeZone: "UTC",
})?.toISOString();
// "2026-11-26T17:00:00.000Z"

getNextClosingTime({
    date: "2026-11-26T18:00:00Z",
    schedule: { hours: { 4: [{ start: "09:00", end: "17:00" }] } },
    timeZone: "UTC",
})?.toISOString();
// "2026-12-03T17:00:00.000Z"
```

## Edge cases

Weekday keys are ISO numbers, so `4` is Thursday. When the instant is open, the result is the end of the current open interval. When it is closed, the result is the end of the next open interval. The search stops after 400 days and returns `undefined` when the schedule does not close. A range whose end is not after its start continues past midnight.

## Related

- [`getNextOpeningTime`](../get-next-opening-time/get-next-opening-time.md)
- [`isOpenAt`](../is-open-at/is-open-at.md)
- [`isWithinBusinessHours`](../is-within-business-hours/is-within-business-hours.md)
