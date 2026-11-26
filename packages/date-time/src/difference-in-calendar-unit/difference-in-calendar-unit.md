# `differenceInCalendarUnit`

Counts calendar boundaries crossed between two instants.

## Import

```ts
import { differenceInCalendarUnit } from "@sgx4u/date-time";
```

## Signature

```ts
function differenceInCalendarUnit(
    later: DateInput,
    earlier: DateInput,
    unit: CalendarUnit,
    options?: TimeZoneOptions & WeekOptions,
): number;
```

## Options

| Name           | Type      | Default     | Meaning                                        |
| -------------- | --------- | ----------- | ---------------------------------------------- |
| `timeZone`     | `string`  | System zone | Zone used to read the calendar fields.         |
| `weekStartsOn` | `Weekday` | `1`         | ISO weekday that starts a week. `1` is Monday. |

## Examples

```ts
differenceInCalendarUnit(
    "2027-01-01T00:00:00Z",
    "2026-12-31T00:00:00Z",
    "year",
    { timeZone: "UTC" },
);
// 1

differenceInCalendarUnit(
    "2026-02-01T00:00:00Z",
    "2026-01-31T00:00:00Z",
    "month",
    { timeZone: "UTC" },
);
// 1

differenceInCalendarUnit(
    "2024-03-01T00:00:00Z",
    "2024-02-28T00:00:00Z",
    "day",
    { timeZone: "UTC" },
);
// 2
```

## Edge cases

December 31 to January 1 is one year even though one calendar day passed. A unit other than `"year"`, `"quarter"`, `"month"`, `"week"`, or `"day"` throws `RangeError`. A date that is not usable returns `undefined`. The result is negative when `later` is before `earlier`. Weeks use `weekStartsOn`.

## Related

- [`differenceInUnit`](../difference-in-unit/difference-in-unit.md) counts whole units that fit between the instants.
- [`endOfUnit`](../end-of-unit/end-of-unit.md) returns the last millisecond of a unit.
- [`startOfUnit`](../start-of-unit/start-of-unit.md) returns the first millisecond of a unit.
