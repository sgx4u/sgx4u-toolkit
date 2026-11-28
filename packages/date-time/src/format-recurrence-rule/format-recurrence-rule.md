# `formatRecurrenceRule`

Writes a recurrence rule as RFC 5545 text.

## Import

```ts
import { formatRecurrenceRule } from "@sgx4u/date-time/recurrence";
```

## Signature

```ts
function formatRecurrenceRule(rule: RecurrenceRule): string;
```

## Parameters

| Name   | Type             | Required | Default | Meaning            |
| ------ | ---------------- | -------- | ------- | ------------------ |
| `rule` | `RecurrenceRule` | yes      |         | The rule to write. |

## Examples

```ts
formatRecurrenceRule({
    start: new Date("2024-12-31T00:00:00Z"),
    frequency: "weekly",
    interval: 1,
    byWeekday: [{ weekday: 2, occurrence: -1 }],
});
// "DTSTART:20241231T000000Z\nRRULE:FREQ=WEEKLY;BYDAY=-1TU"

formatRecurrenceRule({
    start: new Date("2024-02-29T12:00:00Z"),
    frequency: "yearly",
    excludedDates: [new Date("2028-02-29T12:00:00Z")],
});
// "DTSTART:20240229T120000Z\nRRULE:FREQ=YEARLY\nEXDATE:20280229T120000Z"

formatRecurrenceRule({
    start: new Date("2024-11-03T05:30:00Z"),
    frequency: "daily",
    timeZone: "America/New_York",
});
// "DTSTART;TZID=America/New_York:20241103T013000\nRRULE:FREQ=DAILY"
```

## Edge cases

The default `interval` of `1` is omitted. `RDATE` and `EXDATE` lines are written when the rule has `additionalDates` or `excludedDates`. A missing rule throws `TypeError`. In `America/New_York`, both fall-back instants `2024-11-03T05:30:00Z` and `2024-11-03T06:30:00Z` write the wall time `20241103T013000`. `2024-03-10T06:30:00Z` writes `20240310T013000`.

## Related

- [`parseRecurrenceRule`](../parse-recurrence-rule/parse-recurrence-rule.md) reads this text back into a rule.
- [`describeRecurrenceRule`](../describe-recurrence-rule/describe-recurrence-rule.md) writes the rule in English.
