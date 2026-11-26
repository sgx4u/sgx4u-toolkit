# `parseCronExpression`

Parses a cron expression into a schedule.

## Import

```ts
import { parseCronExpression } from "@sgx4u/date-time/cron";
```

## Signature

```ts
function parseCronExpression(
    expression: string,
    options?: ParseCronExpressionOptions,
): CronSchedule | undefined;
```

## Options

| Name      | Type                                 | Default      | Meaning                                                             |
| --------- | ------------------------------------ | ------------ | ------------------------------------------------------------------- |
| `seconds` | `"optional" \| "required" \| "none"` | `"optional"` | Whether a leading seconds field is allowed, required, or forbidden. |

## Examples

```ts
parseCronExpression("0 9 * * 1-5")?.hours;
// [9]

parseCronExpression("@daily")?.hours;
// [0]

parseCronExpression("0 9 * * 1-5", { seconds: "required" });
// undefined

parseCronExpression("@reboot");
// undefined
```

## Edge cases

Text that is not a cron expression returns `undefined`. Five fields are minute, hour, day of month, month, and day of week. A sixth leading field is seconds. `?`, lists, ranges, steps, month and weekday names, `L`, `L-n`, `W`, `LW`, `#`, and `nL` are accepted. `@yearly`, `@annually`, `@monthly`, `@weekly`, `@daily`, `@midnight`, and `@hourly` expand to six-field expressions. `@reboot` returns `undefined`. With `"required"`, a five-field expression returns `undefined`. With `"none"`, a six-field expression returns `undefined`. A value that is not a string throws `TypeError`. An unknown `seconds` mode throws `RangeError`.

## Related

- [`isValidCronExpression`](../is-valid-cron-expression/is-valid-cron-expression.md) reports whether text is a cron expression.
- [`describeCronExpression`](../describe-cron-expression/describe-cron-expression.md) describes a schedule in English.
- [`doesCronMatch`](../does-cron-match/does-cron-match.md) reports whether a schedule fires at a date.
