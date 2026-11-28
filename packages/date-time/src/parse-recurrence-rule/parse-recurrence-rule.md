# `parseRecurrenceRule`

Parses an RFC 5545 recurrence.

## Import

```ts
import { parseRecurrenceRule } from "@sgx4u/date-time/recurrence";
```

## Signature

```ts
function parseRecurrenceRule(value: string): RecurrenceRule | undefined;
```

## Parameters

| Name    | Type     | Required | Default | Meaning        |
| ------- | -------- | -------- | ------- | -------------- |
| `value` | `string` | yes      |         | The rule text. |

## Examples

```ts
parseRecurrenceRule("DTSTART:20261126T090000Z\nRRULE:FREQ=DAILY")?.frequency;
// "daily"

parseRecurrenceRule(
    "DTSTART:20261126T090000Z\nRRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,FR",
)?.interval;
// 2

parseRecurrenceRule(
    "DTSTART:20261126T090000Z\nRRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,FR",
)?.byWeekday;
// [{ weekday: 1 }, { weekday: 5 }]

parseRecurrenceRule(
    "DTSTART:20261126T090000Z\nRRULE:FREQ=DAILY;RSCALE=GREGORIAN",
);
// undefined
```

## Edge cases

Text that is not a supported recurrence returns `undefined`. The text may contain `DTSTART` with `TZID` or `Z`, an `RRULE`, and `RDATE` and `EXDATE` lines. `RSCALE` and `SKIP` return `undefined`. A rule that sets both `COUNT` and `UNTIL` returns `undefined`. A floating start, one with no `Z` and no `TZID`, is stored as an instant and evaluated in UTC. A `TZID` is kept on `timeZone` for later expansion. A value that is not a string throws `TypeError`.

## Related

- [`formatRecurrenceRule`](../format-recurrence-rule/format-recurrence-rule.md) writes a rule as RFC 5545 text.
- [`isValidRecurrenceRule`](../is-valid-recurrence-rule/is-valid-recurrence-rule.md) reports whether text is supported.
- [`describeRecurrenceRule`](../describe-recurrence-rule/describe-recurrence-rule.md) describes a rule in English.
