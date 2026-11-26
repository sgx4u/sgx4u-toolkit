# `isSameUnit`

Reports whether two dates fall in the same unit in a time zone.

## Import

```ts
import { isSameUnit } from "@sgx4u/date-time";
```

## Signature

```ts
function isSameUnit(
    first: DateInput,
    second: DateInput,
    unit: TimeUnit,
    options?: TimeZoneOptions & WeekOptions,
): boolean;
```

## Options

| Name           | Type      | Default                                 | Meaning                                                              |
| -------------- | --------- | --------------------------------------- | -------------------------------------------------------------------- |
| `timeZone`     | `string`  | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`. |
| `weekStartsOn` | `Weekday` | `1`                                     | ISO weekday that starts the week. `1` is Monday and `7` is Sunday.   |

## Examples

```ts
import { isSameUnit } from "@sgx4u/date-time";

isSameUnit("2024-06-15T23:00:00Z", "2024-06-16T02:00:00Z", "day", {
    timeZone: "Asia/Kolkata",
});
// true

isSameUnit("2024-06-15T23:00:00Z", "2024-06-16T02:00:00Z", "day", {
    timeZone: "UTC",
});
// false

isSameUnit("2026-11-23T00:00:00Z", "2026-11-29T00:00:00Z", "week", {
    timeZone: "UTC",
});
// true
```

## Edge cases

The comparison uses the start of the unit, so a daylight-saving day still counts as one day. A week uses `weekStartsOn`, which defaults to Monday. An unknown unit or zone throws a `RangeError`.

## Related

- [`getWeekOfYear`](../get-week-of-year/get-week-of-year.md)
- [`isToday`](../is-today/is-today.md)
- [`getDateParts`](../get-date-parts/get-date-parts.md)
