# `getPreviousCronRuns`

Returns earlier runs, newest first.

## Import

```ts
import { getPreviousCronRuns } from "@sgx4u/date-time/cron";
```

## Examples

`0 9 * * 1-5` is 09:00 on Monday through Friday. The next run after 08:00 UTC on 26 November 2026 for `0 9 * * *` is 09:00 that day.

## Edge cases

`@reboot` returns `undefined`. `count` must be an integer from 1 through 1000. The forward search stops after 366 days.

## Related

- [`parseCronExpression`](../parse-cron-expression/parse-cron-expression.md)
