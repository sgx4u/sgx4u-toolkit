# `isValidCronExpression`

Reports whether text is a cron expression.

## Import

```ts
import { isValidCronExpression } from "@sgx4u/date-time/cron";
```

## Signature

```ts
function isValidCronExpression(
    expression: string,
    options?: ParseCronExpressionOptions,
): boolean;
```

## Options

| Name      | Type                                 | Default      | Meaning                                                                                   |
| --------- | ------------------------------------ | ------------ | ----------------------------------------------------------------------------------------- |
| `seconds` | `"optional" \| "required" \| "none"` | `"optional"` | `"optional"` accepts five or six fields. `"required"` accepts six. `"none"` accepts five. |

## Examples

```ts
import { isValidCronExpression } from "@sgx4u/date-time/cron";

isValidCronExpression("@daily");
// true

isValidCronExpression("@reboot");
// false

isValidCronExpression("0 9 * * *", { seconds: "required" });
// false

isValidCronExpression("0 0 9 * * *", { seconds: "required" });
// true
```

## Edge cases

This is `true` when the text parses. `@yearly`, `@annually`, `@monthly`, `@weekly`, `@daily`, `@midnight`, and `@hourly` are names. `@reboot` does not parse. `expression` must be a string. An unknown `seconds` mode throws a `RangeError`.

## Related

- [`getNextCronRuns`](../get-next-cron-runs/get-next-cron-runs.md)
- [`getPreviousCronRuns`](../get-previous-cron-runs/get-previous-cron-runs.md)
- [`parseCronExpression`](../parse-cron-expression/parse-cron-expression.md)
