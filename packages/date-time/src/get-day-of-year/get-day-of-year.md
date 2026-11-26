# `getDayOfYear`

Returns the day of the year, from 1 through 366.

## Import

```ts
import { getDayOfYear } from "@sgx4u/date-time";
```

## Signature

```ts
function getDayOfYear(date: DateInput, options?: TimeZoneOptions): number;
```

## Options

| Name       | Type     | Default                                 | Meaning                                                              |
| ---------- | -------- | --------------------------------------- | -------------------------------------------------------------------- |
| `timeZone` | `string` | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`. |

## Examples

```ts
import { getDayOfYear } from "@sgx4u/date-time";

getDayOfYear("2024-01-01T00:00:00Z", { timeZone: "UTC" });
// 1

getDayOfYear("2024-03-01T00:00:00Z", { timeZone: "UTC" });
// 61

getDayOfYear("2023-03-01T00:00:00Z", { timeZone: "UTC" });
// 60
```

## Edge cases

The number is the calendar day in `timeZone`, so a late UTC instant can already be the next day in a zone ahead of UTC. March 1 is day 61 in a leap year and day 60 otherwise. A value that is not a real date throws a `RangeError`.

## Related

- [`getDaysInYear`](../get-days-in-year/get-days-in-year.md)
- [`isLeapYear`](../is-leap-year/is-leap-year.md)
- [`getQuarter`](../get-quarter/get-quarter.md)
