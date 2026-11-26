# `addBusinessHours`

Adds working time, skipping nights, weekends, and holidays.

## Import

```ts
import { addBusinessHours } from "@sgx4u/date-time";
```

## Signature

```ts
function addBusinessHours(
    params: AddBusinessHoursParams,
): Date | undefined;
```

## Options

| Name            | Type                                           | Required | Default                    | Meaning                          |
| --------------- | ---------------------------------------------- | -------- | -------------------------- | -------------------------------- |
| `date`          | `DateInput`                                    | yes      |                            | Start instant.                   |
| `duration`      | `Duration`                                     | yes      |                            | Clock units only.                |
| `workingDays`   | `readonly Weekday[]`                           | no       | `[1, 2, 3, 4, 5]`          | ISO weekdays that are open.      |
| `businessHours` | `readonly TimeRange[]`                         | no       | `[{ start: "09:00", end: "17:00" }]` | Working windows.     |
| `holidays`      | `readonly (ConfiguredHoliday \| DateInput)[]` | no       | `[]`                       | Closed dates in `timeZone`.      |
| `timeZone`      | `string`                                       | no       | System zone                | IANA name or fixed offset.       |

## Examples

```ts
addBusinessHours({
    date: "2026-11-26T16:00:00Z",
    duration: { hours: 2 },
    timeZone: "UTC",
})?.toISOString();
// "2026-11-27T10:00:00.000Z"
```

## Edge cases

Only clock units are accepted; calendar units throw `RangeError`. A start outside working hours begins at the next opening when the duration is positive, or at the end of the previous opening when it is negative. A bad `date` or `duration` returns `undefined`. Invalid `workingDays`, `businessHours`, or `timeZone` throws. When no business day exists within the safety cap, the call throws `RangeError`.

## Related

- [`addBusinessDays`](../add-business-days/add-business-days.md) moves by whole business days.
- [`differenceInBusinessHours`](../difference-in-business-hours/difference-in-business-hours.md) measures elapsed working time.