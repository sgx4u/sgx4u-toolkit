# `getNextOpeningTime`

Returns the next time a weekly schedule opens.

## Import

```ts
import { getNextOpeningTime } from "@sgx4u/date-time";
```

## Signature

```ts
function getNextOpeningTime(params: GetNextOpeningTimeParams): Date | undefined;
```

## Parameters

| Name       | Type             | Required | Default | Meaning                             |
| ---------- | ---------------- | -------- | ------- | ----------------------------------- |
| `date`     | `DateInput`      | yes      |         | The instant to search from.         |
| `schedule` | `WeeklySchedule` | yes      |         | Weekly hours and optional closures. |
| `timeZone` | `string`         | no       |         | Zone used to read the schedule.     |

## Examples

```ts
import { getNextOpeningTime } from "@sgx4u/date-time";

getNextOpeningTime({
    date: "2026-11-26T08:00:00Z",
    schedule: { hours: { 4: [{ start: "09:00", end: "17:00" }] } },
    timeZone: "UTC",
})?.toISOString();
// "2026-11-26T09:00:00.000Z"

getNextOpeningTime({
    date: "2026-11-26T12:00:00Z",
    schedule: { hours: { 4: [{ start: "09:00", end: "17:00" }] } },
    timeZone: "UTC",
})?.toISOString();
// "2026-12-03T09:00:00.000Z"

getNextOpeningTime({
    date: "2026-11-27T12:00:00Z",
    schedule: { hours: { 4: [{ start: "09:00", end: "17:00" }] } },
    timeZone: "UTC",
})?.toISOString();
// "2026-12-03T09:00:00.000Z"
```

## Edge cases

An instant that is already inside open hours is not returned. Weekday `4` is Thursday. The search stops after 400 days and returns `undefined` when the schedule never opens. A range whose end is not after its start continues past midnight. A closure removes that calendar day.

## Related

- [`getNextClosingTime`](../get-next-closing-time/get-next-closing-time.md)
- [`isOpenAt`](../is-open-at/is-open-at.md)
- [`getNextBusinessHoursStart`](../get-next-business-hours-start/get-next-business-hours-start.md)
