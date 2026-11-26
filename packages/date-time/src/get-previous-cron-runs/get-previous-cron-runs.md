# `getPreviousCronRuns`

Returns earlier times a cron schedule fired, newest first.

## Import

```ts
import { getPreviousCronRuns } from "@sgx4u/date-time/cron";
```

## Signature

```ts
function getPreviousCronRuns(
    schedule: string | CronSchedule,
    options?: PreviousCronRunsOptions,
): Date[];
```

## Options

| Name        | Type        | Default                                 | Meaning                                                              |
| ----------- | ----------- | --------------------------------------- | -------------------------------------------------------------------- |
| `now`       | `DateInput` | `Date.now()`, read on each call         | The instant to use instead of the current time.                      |
| `timeZone`  | `string`    | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`. |
| `count`     | `number`    | `1`                                     | How many runs to return. Must be an integer from 1 through 1000.     |
| `startDate` | `DateInput` | none                                    | Stop the search at this instant. A run at `startDate` is excluded.   |

## Examples

```ts
import { getPreviousCronRuns } from "@sgx4u/date-time/cron";

getPreviousCronRuns("0 9 * * *", {
    now: "2026-11-26T10:00:00Z",
    timeZone: "UTC",
})[0]?.toISOString();
// "2026-11-26T09:00:00.000Z"

getPreviousCronRuns("0 9 * * *", {
    now: "2026-11-26T10:00:00Z",
    timeZone: "UTC",
    count: 2,
}).map((date) => date.toISOString());
// ["2026-11-26T09:00:00.000Z", "2026-11-25T09:00:00.000Z"]

getPreviousCronRuns("@reboot", {
    now: "2026-11-26T10:00:00Z",
    timeZone: "UTC",
});
// []
```

## Edge cases

The newest run is first. A run at `now` is not included. An expression that does not parse, including `@reboot`, returns `[]`. `count` outside 1 through 1000 throws a `RangeError`. The backward search stops at `startDate` and after 366 days.

## Related

- [`getNextCronRuns`](../get-next-cron-runs/get-next-cron-runs.md)
- [`isValidCronExpression`](../is-valid-cron-expression/is-valid-cron-expression.md)
- [`parseCronExpression`](../parse-cron-expression/parse-cron-expression.md)
