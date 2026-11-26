# `describeRecurrenceRule`

Describes a recurrence rule in English.

## Import

```ts
import { describeRecurrenceRule } from "@sgx4u/date-time/recurrence";
```

## Signature

```ts
function describeRecurrenceRule(rule: RecurrenceRule): string;
```

## Parameters

| Name   | Type             | Required | Default | Meaning               |
| ------ | ---------------- | -------- | ------- | --------------------- |
| `rule` | `RecurrenceRule` | yes      |         | The rule to describe. |

## Examples

```ts
describeRecurrenceRule({
    start: new Date("2026-11-26T09:00:00Z"),
    frequency: "weekly",
    interval: 2,
    byWeekday: [{ weekday: 1 }, { weekday: 5 }],
});
// "Every 2 weeks on Monday and Friday"

describeRecurrenceRule({
    start: new Date("2024-02-29T00:00:00Z"),
    frequency: "yearly",
});
// "Every year"

describeRecurrenceRule({
    start: new Date("2025-12-31T00:00:00Z"),
    frequency: "monthly",
    interval: 3,
});
// "Every 3 months"
```

## Edge cases

An omitted `interval` is described as every one of the frequency, so a daily rule is `"Every day"`. A missing rule throws `TypeError`.

## Related

- [`formatRecurrenceRule`](../format-recurrence-rule/format-recurrence-rule.md) writes the same rule as RFC 5545 text.
- [`parseRecurrenceRule`](../parse-recurrence-rule/parse-recurrence-rule.md) reads RFC 5545 text into a rule.
- [`listRecurrenceOccurrences`](../list-recurrence-occurrences/list-recurrence-occurrences.md) lists the instants the rule produces.
