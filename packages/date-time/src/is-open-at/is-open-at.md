# `isOpenAt`

Reports whether a weekly schedule is open at a date.

## Import

```ts
import { isOpenAt } from "@sgx4u/date-time";
```

## Signature

```ts
function isOpenAt(
    date: DateInput,
    schedule: WeeklySchedule,
    options?: TimeZoneOptions,
): boolean;
```

## Options

| Name       | Type     | Default                                 | Meaning                                                              |
| ---------- | -------- | --------------------------------------- | -------------------------------------------------------------------- |
| `timeZone` | `string` | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`. |

## Examples

```ts
import { isOpenAt } from "@sgx4u/date-time";

isOpenAt(
    "2026-11-26T12:00:00Z",
    { hours: { 4: [{ start: "09:00", end: "17:00" }] } },
    { timeZone: "UTC" },
);
// true

isOpenAt(
    "2026-11-26T08:00:00Z",
    { hours: { 4: [{ start: "09:00", end: "17:00" }] } },
    { timeZone: "UTC" },
);
// false

isOpenAt(
    "2026-11-26T17:00:00Z",
    { hours: { 4: [{ start: "09:00", end: "17:00" }] } },
    { timeZone: "UTC" },
);
// false
```

## Edge cases

The end of a range is excluded. A range whose end is not after its start continues past midnight. A closure removes that calendar day and the overnight range that starts on it. Weekday `4` is Thursday. A value that is not a real date throws a `RangeError`.

## Related

- [`getNextOpeningTime`](../get-next-opening-time/get-next-opening-time.md)
- [`getNextClosingTime`](../get-next-closing-time/get-next-closing-time.md)
- [`isWithinBusinessHours`](../is-within-business-hours/is-within-business-hours.md)
