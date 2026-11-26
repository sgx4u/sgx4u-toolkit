# `isTimeOfDayInRange`

Reports whether a time falls in a daily range.

## Import

```ts
import { isTimeOfDayInRange } from "@sgx4u/date-time";
```

## Signature

```ts
function isTimeOfDayInRange(
    time: TimeOfDay,
    range: TimeRange,
    options?: TimeOfDayRangeOptions,
): boolean;
```

## Options

| Name         | Type      | Default | Meaning                              |
| ------------ | --------- | ------- | ------------------------------------ |
| `includeEnd` | `boolean` | `false` | Whether the end of the range counts. |

## Examples

```ts
import { isTimeOfDayInRange } from "@sgx4u/date-time";

isTimeOfDayInRange(
    { hour: 23, minute: 0, second: 0, millisecond: 0 },
    { start: "22:00", end: "06:00" },
);
// true

isTimeOfDayInRange(
    { hour: 6, minute: 0, second: 0, millisecond: 0 },
    { start: "22:00", end: "06:00" },
);
// false

isTimeOfDayInRange(
    { hour: 6, minute: 0, second: 0, millisecond: 0 },
    { start: "22:00", end: "06:00" },
    { includeEnd: true },
);
// true
```

## Edge cases

A range whose end is not after its start continues past midnight. `22:00`–`06:00` contains 23:00 and 05:00. The end is excluded unless `includeEnd` is `true`. A bound that cannot be read throws a `TypeError`.

## Related

- [`getTimeOfDay`](../get-time-of-day/get-time-of-day.md)
- [`isOpenAt`](../is-open-at/is-open-at.md)
- [`isWithinBusinessHours`](../is-within-business-hours/is-within-business-hours.md)
