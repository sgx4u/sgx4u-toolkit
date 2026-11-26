# `isValidRecurrenceRule`

Reports whether text is a supported recurrence rule.

## Import

```ts
import { isValidRecurrenceRule } from "@sgx4u/date-time/recurrence";
```

## Signature

```ts
function isValidRecurrenceRule(value: string): boolean;
```

## Options

This function has no options.

## Examples

```ts
import { isValidRecurrenceRule } from "@sgx4u/date-time/recurrence";

isValidRecurrenceRule("DTSTART:20261126T090000Z\nRRULE:FREQ=DAILY");
// true

isValidRecurrenceRule("DTSTART:20261126T090000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO");
// true

isValidRecurrenceRule("RRULE:FREQ=WEEKLY;BYDAY=MO");
// false
```

## Edge cases

This is `true` when the text parses as a supported rule. A supported rule includes a `DTSTART` line; an `RRULE` line on its own returns `false`. `value` must be a string, and any other type throws a `TypeError`. Unsupported text returns `false`.

## Related

- [`getNextRecurrenceOccurrence`](../get-next-recurrence-occurrence/get-next-recurrence-occurrence.md)
- [`listRecurrenceOccurrences`](../list-recurrence-occurrences/list-recurrence-occurrences.md)
- [`parseRecurrenceRule`](../parse-recurrence-rule/parse-recurrence-rule.md)
