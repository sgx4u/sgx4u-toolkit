# `isValidCronExpression`

Reports whether text is a cron expression.

## Import

```ts
import { isValidCronExpression } from "@sgx4u/date-time/cron";
```

## Signature

```ts
function isValidCronExpression(params: IsValidCronExpressionParams): boolean;
```

## Parameters

| Name         | Type                                 | Required | Default      | Meaning                                                            |
| ------------ | ------------------------------------ | -------- | ------------ | ------------------------------------------------------------------ |
| `expression` | `string`                             | yes      |              | The cron text.                                                     |
| `seconds`    | `"none" \| "optional" \| "required"` | no       | `"optional"` | `"optional"` accepts five or six fields. `"required"` accepts six. |

## Examples

```ts
import { isValidCronExpression } from "@sgx4u/date-time/cron";

isValidCronExpression({ expression: "@daily" });
// true

isValidCronExpression({ expression: "@reboot" });
// false

isValidCronExpression({ expression: "0 9 * * *", seconds: "required" });
// false

isValidCronExpression({ expression: "0 0 9 * * *", seconds: "required" });
// true
```

## Edge cases

This is `true` when the text parses. `@yearly`, `@annually`, `@monthly`, `@weekly`, `@daily`, `@midnight`, and `@hourly` are names. `@reboot` does not parse. `expression` must be a string. An unknown `seconds` mode throws a `RangeError`.

## Related

- [`getNextCronRuns`](../get-next-cron-runs/get-next-cron-runs.md)
- [`getPreviousCronRuns`](../get-previous-cron-runs/get-previous-cron-runs.md)
- [`parseCronExpression`](../parse-cron-expression/parse-cron-expression.md)
