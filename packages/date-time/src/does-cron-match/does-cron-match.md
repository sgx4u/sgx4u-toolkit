# `doesCronMatch`

Reports whether a cron schedule fires at an instant.

## Import

```ts
import { doesCronMatch } from "@sgx4u/date-time/cron";
```

## Signature

```ts
function doesCronMatch(params: DoesCronMatchParams): boolean;
```

## Parameters

| Name       | Type                     | Required | Default                                  | Meaning                                            |
| ---------- | ------------------------ | -------- | ---------------------------------------- | -------------------------------------------------- |
| `schedule` | `string \| CronSchedule` | yes      |                                          | A cron expression or a parsed schedule.            |
| `date`     | `DateInput`              | yes      |                                          | The instant to test.                               |
| `timeZone` | `string`                 | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset |

## Examples

```ts
doesCronMatch({
    schedule: "0 9 * * *",
    date: "2026-11-26T09:00:00Z",
    timeZone: "UTC",
});
// true

doesCronMatch({
    schedule: "0 9 * * *",
    date: "2026-11-26T09:01:00Z",
    timeZone: "UTC",
});
// false

doesCronMatch({
    schedule: "0 0 29 2 *",
    date: "2024-02-29T00:00:00Z",
    timeZone: "UTC",
});
// true

doesCronMatch({
    schedule: "30 1 * * *",
    date: "2024-11-03T05:30:00Z",
    timeZone: "America/New_York",
});
// true
```

## Edge cases

When both the day of the month and the day of the week are restricted, either field matching is enough. An expression that does not parse returns `false`. A date that is not usable returns `undefined`. On the New York fall-back, both 01:30 instants (`2024-11-03T05:30:00Z` and `2024-11-03T06:30:00Z`) match `30 1 * * *`. The skipped 02:30 on `2024-03-10` does not match `30 2 * * *`.

## Related

- [`describeCronExpression`](../describe-cron-expression/describe-cron-expression.md) writes the schedule in English.
- [`parseCronExpression`](../parse-cron-expression/parse-cron-expression.md) returns a `CronSchedule`.
- [`getNextCronRuns`](../get-next-cron-runs/get-next-cron-runs.md) lists the next times a schedule fires.
