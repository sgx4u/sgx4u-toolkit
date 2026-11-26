# `createNaturalLanguage`

Builds English date functions with the same config as `createDateTime`.

## Import

```ts
import { createNaturalLanguage } from "@sgx4u/date-time/natural-language";
```

## Signature

```ts
function createNaturalLanguage<
    const Config extends DateTimeConfig = DateTimeConfig,
>(config?: Config): NaturalLanguageInstance<Config>;
```

## Parameters

| Name                     | Type                            | Required | Default                                                 | Meaning                                                                     |
| ------------------------ | ------------------------------- | -------- | ------------------------------------------------------- | --------------------------------------------------------------------------- |
| `timeZone`               | `string`                        | no       | The system time zone, read on each call.                | IANA time zone, `"UTC"`, or a fixed offset (`+05:30`, `+0530`, `+05`).      |
| `locale`                 | `string \| readonly string[]`   | no       | The runtime's default locale.                           | BCP 47 language tag, or tags in preference order.                           |
| `weekStartsOn`           | `Weekday`                       | no       | `1`                                                     | ISO weekday that starts a week. `1` is Monday and `7` is Sunday.            |
| `minimumDaysInFirstWeek` | `number`                        | no       | `1`                                                     | How many days of the year the first week must contain.                      |
| `workingDays`            | `readonly Weekday[]`            | no       | `[1, 2, 3, 4, 5]` (Monday through Friday).              | ISO weekdays that count as business days. Every other weekday is a weekend. |
| `businessHours`          | `readonly TimeRange[]`          | no       | `[{ start: "09:00", end: "17:00" }]`                    | Working windows on a business day. An empty list means the whole day.       |
| `disambiguation`         | `Disambiguation`                | no       | `"compatible"`                                          | How a skipped or repeated wall time becomes an instant.                     |
| `now`                    | `() => Date`                    | no       | `() => new Date()`                                      | Clock used when a call does not pass `now`.                                 |
| `holidays`               | `readonly ConfiguredHoliday[]`  | no       | `[]`                                                    | Holidays closed by business-day functions and `isHoliday`.                  |
| `numeric`                | `"always" \| "auto"`            | no       | `"auto"`                                                | `numeric` passed to relative-time formatting when a call omits it.          |
| `overflow`               | `Overflow`                      | no       | `"constrain"`                                           | What to do when a calendar day does not exist in the target month.          |
| `formatPattern`          | `string`                        | no       | No pattern. A call must pass `pattern`.                 | Pattern used by `formatDate` when a call omits `pattern`.                   |
| `fiscalYearStartMonth`   | `number`                        | no       | None. Fiscal calls must pass it unless the config does. | Month the fiscal year starts, from `1` through `12`.                        |
| `fiscalYearLabel`        | `"start-year" \| "end-year"`    | no       | `"end-year"`                                            | Which calendar year labels a fiscal year.                                   |
| `relativeTimeStyle`      | `"long" \| "short" \| "narrow"` | no       | `"long"`                                                | Width of relative-time text when a call omits `style`.                      |

## Examples

```ts
const english = createNaturalLanguage({ timeZone: "UTC" });
english.parseNaturalDate({ text: "tomorrow", now: "2026-11-26T12:00:00Z" });
```
