# `doesCronMatch`

Reports whether a cron schedule fires at an instant.

## Import

```ts
import { doesCronMatch } from "@sgx4u/date-time/cron";
```

## Signature

```ts
function doesCronMatch(
    schedule: string | CronSchedule,
    date: DateInput,
    options?: TimeZoneOptions,
): boolean;
```

## Options

| Name       | Type     | Default     | Meaning                          |
| ---------- | -------- | ----------- | -------------------------------- |
| `timeZone` | `string` | System zone | Zone used to read the wall time. |

## Examples

```ts
doesCronMatch("0 9 * * *", "2026-11-26T09:00:00Z", { timeZone: "UTC" });
// true

doesCronMatch("0 9 * * *", "2026-11-26T09:01:00Z", { timeZone: "UTC" });
// false

doesCronMatch("0 0 29 2 *", "2024-02-29T00:00:00Z", { timeZone: "UTC" });
// true

doesCronMatch("30 1 * * *", "2024-11-03T05:30:00Z", {
    timeZone: "America/New_York",
});
// true
```

## Edge cases

When both the day of the month and the day of the week are restricted, either field matching is enough. An expression that does not parse returns `false`. A date that does not parse throws `RangeError`. On the New York fall-back, both 01:30 instants (`2024-11-03T05:30:00Z` and `2024-11-03T06:30:00Z`) match `30 1 * * *`. The skipped 02:30 on `2024-03-10` does not match `30 2 * * *`.

## Related

- [`describeCronExpression`](../describe-cron-expression/describe-cron-expression.md) writes the schedule in English.
- [`parseCronExpression`](../parse-cron-expression/parse-cron-expression.md) returns a `CronSchedule`.
- [`getNextCronRuns`](../get-next-cron-runs/get-next-cron-runs.md) lists the next times a schedule fires.
