# `describeCronExpression`

Describes a cron expression in English.

## Import

```ts
import { describeCronExpression } from "@sgx4u/date-time/cron";
```

## Signature

```ts
function describeCronExpression(
    schedule: string | CronSchedule,
    options?: DescribeCronExpressionOptions,
): string;
```

## Options

| Name        | Type             | Default | Meaning                                         |
| ----------- | ---------------- | ------- | ----------------------------------------------- |
| `hourCycle` | `"h12" \| "h23"` | `"h12"` | `"h12"` writes AM and PM. `"h23"` writes 00–23. |

## Examples

```ts
describeCronExpression("0 9 * * 1-5");
// "At 09:00 AM, Monday through Friday"

describeCronExpression("0 9 * * 1-5", { hourCycle: "h23" });
// "At 09:00, Monday through Friday"

describeCronExpression("0 0 29 2 *");
// "At 12:00 AM"

describeCronExpression("0 0 * * 0");
// "At 12:00 AM, Sunday"
```

## Edge cases

Text that does not parse, including an empty string, returns `""`. An unknown `hourCycle` throws `RangeError`. A parsed `CronSchedule` is described the same way as its expression.

## Related

- [`parseCronExpression`](../parse-cron-expression/parse-cron-expression.md) returns the schedule this function describes.
- [`doesCronMatch`](../does-cron-match/does-cron-match.md) tests one instant against a schedule.
- [`getNextCronRuns`](../get-next-cron-runs/get-next-cron-runs.md) lists the next times a schedule fires.
