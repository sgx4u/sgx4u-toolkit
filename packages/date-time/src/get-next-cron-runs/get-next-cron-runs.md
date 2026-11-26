# `getNextCronRuns`

Returns the next times a cron schedule fires.

## Import

```ts
import { getNextCronRuns } from "@sgx4u/date-time/cron";
```

## Signature

```ts
function getNextCronRuns(params: GetNextCronRunsParams): Date[] | undefined;
```

## Parameters

| Name       | Type                     | Required | Default                                  | Meaning                                                           |
| ---------- | ------------------------ | -------- | ---------------------------------------- | ----------------------------------------------------------------- |
| `schedule` | `string \| CronSchedule` | yes      |                                          | A cron expression or a parsed schedule.                           |
| `count`    | `number`                 | no       | `1`                                      | How many runs to return.                                          |
| `endDate`  | `DateInput`              | no       |                                          | The search stops at this instant. A run at `endDate` is excluded. |
| `now`      | `DateInput`              | no       | `Date.now()`, read on each call.         | The instant to use instead of the current time.                   |
| `timeZone` | `string`                 | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset                |

## Examples

```ts
import { getNextCronRuns } from "@sgx4u/date-time/cron";

getNextCronRuns({
    schedule: "0 9 * * *",
    now: "2026-11-26T08:00:00Z",
    timeZone: "UTC",
})[0]?.toISOString();
// "2026-11-26T09:00:00.000Z"

getNextCronRuns({
    schedule: "0 9 * * 1-5",
    now: "2026-11-26T08:00:00Z",
    timeZone: "UTC",
    count: 2,
}).map((date) => date.toISOString());
// ["2026-11-26T09:00:00.000Z", "2026-11-27T09:00:00.000Z"]

getNextCronRuns({
    schedule: "@reboot",
    now: "2026-11-26T08:00:00Z",
    timeZone: "UTC",
});
// []

getNextCronRuns({
    schedule: "0 9 * * *",
    now: "2026-11-26T08:00:00Z",
    timeZone: "UTC",
    endDate: "2026-11-26T09:00:00Z",
});
// []
```

## Edge cases

Runs are oldest first. A wall time skipped by daylight saving does not run, and a repeated wall time runs once, at the earlier instant. The search stops at `endDate` and after 366 days. An expression that does not parse, including `@reboot`, returns `[]`. `count` outside 1 through 1000 throws a `RangeError`.

## Related

- [`getPreviousCronRuns`](../get-previous-cron-runs/get-previous-cron-runs.md)
- [`isValidCronExpression`](../is-valid-cron-expression/is-valid-cron-expression.md)
- [`parseCronExpression`](../parse-cron-expression/parse-cron-expression.md)
