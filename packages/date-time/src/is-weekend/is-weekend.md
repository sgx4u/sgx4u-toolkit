# `isWeekend`

Reports whether a date falls on a weekend day.

## Import

```ts
import { isWeekend } from "@sgx4u/date-time";
```

## Signature

```ts
function isWeekend(params: IsWeekendParams): boolean;
```

## Parameters

| Name          | Type                 | Required | Default                                  | Meaning                                                       |
| ------------- | -------------------- | -------- | ---------------------------------------- | ------------------------------------------------------------- |
| `date`        | `DateInput`          | yes      |                                          | The date to test.                                             |
| `workingDays` | `readonly Weekday[]` | no       | `[1, 2, 3, 4, 5]`                        | ISO weekdays that are open. Every other weekday is a weekend. |
| `timeZone`    | `string`             | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset            |

## Examples

```ts
import { isWeekend } from "@sgx4u/date-time";

isWeekend({ date: "2026-11-28T00:00:00Z", timeZone: "UTC" });
// true

isWeekend({ date: "2026-11-26T00:00:00Z", timeZone: "UTC" });
// false

isWeekend({
    date: "2026-11-27T00:00:00Z",
    timeZone: "UTC",
    workingDays: [1, 2, 3, 4, 7],
});
// true
```

## Edge cases

The default working week is Monday through Friday, so the weekend is Saturday and Sunday. Pass `workingDays` to choose different open days, such as Sunday through Thursday. A weekday outside 1 through 7 throws a `RangeError`. The day is read in `timeZone`.

## Related

- [`isBusinessDay`](../is-business-day/is-business-day.md)
- [`getLocaleWeekInfo`](../get-locale-week-info/get-locale-week-info.md)
- [`getNextWeekday`](../get-next-weekday/get-next-weekday.md)
