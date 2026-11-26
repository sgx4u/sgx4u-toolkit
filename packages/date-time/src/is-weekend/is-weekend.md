# `isWeekend`

Reports whether a date falls on a weekend day.

## Import

```ts
import { isWeekend } from "@sgx4u/date-time";
```

## Signature

```ts
function isWeekend(date: DateInput, options?: IsWeekendOptions): boolean;
```

## Options

| Name          | Type                 | Default                                 | Meaning                                                                |
| ------------- | -------------------- | --------------------------------------- | ---------------------------------------------------------------------- |
| `timeZone`    | `string`             | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`.   |
| `weekendDays` | `readonly Weekday[]` | `[6, 7]`                                | ISO weekdays that are weekend days. `6` is Saturday and `7` is Sunday. |

## Examples

```ts
import { isWeekend } from "@sgx4u/date-time";

isWeekend("2026-11-28T00:00:00Z", { timeZone: "UTC" });
// true

isWeekend("2026-11-26T00:00:00Z", { timeZone: "UTC" });
// false

isWeekend("2026-11-27T00:00:00Z", {
    timeZone: "UTC",
    weekendDays: [5, 6],
});
// true
```

## Edge cases

The default weekend is Saturday and Sunday. Pass `weekendDays` for a different week, such as Friday and Saturday. A weekday outside 1 through 7 throws a `RangeError`. The day is read in `timeZone`.

## Related

- [`isBusinessDay`](../is-business-day/is-business-day.md)
- [`getLocaleWeekInfo`](../get-locale-week-info/get-locale-week-info.md)
- [`getNextWeekday`](../get-next-weekday/get-next-weekday.md)
