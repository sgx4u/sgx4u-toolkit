# `parseCronExpression`

Parses a cron expression into a schedule.

## Import

```ts
import { parseCronExpression } from "@sgx4u/date-time/cron";
```

## Signature

```ts
function parseCronExpression(
    params: ParseCronExpressionParams,
): CronSchedule | undefined;
```

## Parameters

| Name         | Type                                 | Required | Default      | Meaning                                                            |
| ------------ | ------------------------------------ | -------- | ------------ | ------------------------------------------------------------------ |
| `expression` | `string`                             | yes      |              | The cron text.                                                     |
| `seconds`    | `"none" \| "optional" \| "required"` | no       | `"optional"` | `"optional"` accepts five or six fields. `"required"` accepts six. |

## Examples

```ts
parseCronExpression({ expression: "0 9 * * 1-5" })?.hours;
// [9]

parseCronExpression({ expression: "@daily" })?.hours;
// [0]

parseCronExpression({ expression: "0 9 * * 1-5", seconds: "required" });
// undefined

parseCronExpression({ expression: "@reboot" });
// undefined
```

## Edge cases

Text that is not a cron expression returns `undefined`. Five fields are minute, hour, day of month, month, and day of week. A sixth leading field is seconds. `?`, lists, ranges, steps, month and weekday names, `L`, `L-n`, `W`, `LW`, `#`, and `nL` are accepted. `@yearly`, `@annually`, `@monthly`, `@weekly`, `@daily`, `@midnight`, and `@hourly` expand to six-field expressions. `@reboot` returns `undefined`. With `"required"`, a five-field expression returns `undefined`. With `"none"`, a six-field expression returns `undefined`. A value that is not a string throws `TypeError`. An unknown `seconds` mode throws `RangeError`.

## Related

- [`isValidCronExpression`](../is-valid-cron-expression/is-valid-cron-expression.md) reports whether text is a cron expression.
- [`describeCronExpression`](../describe-cron-expression/describe-cron-expression.md) describes a schedule in English.
- [`doesCronMatch`](../does-cron-match/does-cron-match.md) reports whether a schedule fires at a date.
