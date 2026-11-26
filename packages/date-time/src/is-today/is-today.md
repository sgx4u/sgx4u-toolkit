# `isToday`

Reports whether a date falls on today's calendar day in a time zone.

## Import

```ts
import { isToday } from "@sgx4u/date-time";
```

## Signature

```ts
function isToday(params: IsTodayParams): boolean;
```

## Parameters

| Name       | Type        | Required | Default | Meaning                                         |
| ---------- | ----------- | -------- | ------- | ----------------------------------------------- |
| `date`     | `DateInput` | yes      |         | The date to test.                               |
| `now`      | `DateInput` | no       |         | The instant to use instead of the current time. |
| `timeZone` | `string`    | no       |         | Zone used to read calendar days.                |

## Examples

```ts
import { isToday } from "@sgx4u/date-time";

isToday({
    date: "2026-11-26T23:00:00Z",
    now: "2026-11-26T01:00:00Z",
    timeZone: "UTC",
});
// true

isToday({
    date: "2026-11-26T12:00:00Z",
    now: "2026-11-26T20:00:00Z",
    timeZone: "UTC",
});
// true

isToday({
    date: "2026-11-26T12:00:00Z",
    now: "2026-11-26T20:00:00Z",
    timeZone: "Asia/Kolkata",
});
// false
```

## Edge cases

The calendar day is the day in `timeZone`. The same two instants can be the same UTC day and different local days. `now` defaults to the current time. A value that is not a real date returns `undefined`.

## Related

- [`isTomorrow`](../is-tomorrow/is-tomorrow.md)
- [`isYesterday`](../is-yesterday/is-yesterday.md)
- [`isSameUnit`](../is-same-unit/is-same-unit.md)
