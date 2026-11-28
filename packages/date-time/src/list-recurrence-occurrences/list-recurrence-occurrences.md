# `listRecurrenceOccurrences`

Lists occurrences of a recurrence rule inside an interval.

## Import

```ts
import { listRecurrenceOccurrences } from "@sgx4u/date-time/recurrence";
```

## Signature

```ts
function listRecurrenceOccurrences(
    params: ListRecurrenceOccurrencesParams,
): Date[];
```

## Parameters

| Name    | Type             | Required | Default | Meaning                                             |
| ------- | ---------------- | -------- | ------- | --------------------------------------------------- |
| `rule`  | `RecurrenceRule` | yes      |         | The recurrence rule.                                |
| `start` | `DateInput`      | yes      |         | The inclusive start of the half-open search window. |
| `end`   | `DateInput`      | yes      |         | The exclusive end of the half-open search window.   |
| `limit` | `number`         | no       | `1000`  | The most occurrences that may be returned.          |

## Examples

```ts
import { listRecurrenceOccurrences } from "@sgx4u/date-time/recurrence";

listRecurrenceOccurrences({
    rule: {
        start: new Date("2026-11-26T09:00:00Z"),
        frequency: "daily",
        count: 2,
    },
    between: {
        start: new Date("2026-11-26T00:00:00Z"),
        end: new Date("2026-11-30T00:00:00Z"),
    },
}).map((date) => date.toISOString());
// ["2026-11-26T09:00:00.000Z", "2026-11-27T09:00:00.000Z"]

listRecurrenceOccurrences({
    rule: { start: new Date("2026-11-26T09:00:00Z"), frequency: "daily" },
    between: {
        start: new Date("2026-11-27T00:00:00Z"),
        end: new Date("2026-11-28T00:00:00Z"),
    },
    limit: 10,
}).length;
// 1
```

## Edge cases

`between` is half-open. Occurrences are generated on the wall clock in the rule's time zone. A floating rule is evaluated in UTC. A day that does not exist, such as 30 February, is skipped. More occurrences than `limit` throws a `RangeError`.

## Related

- [`getNextRecurrenceOccurrence`](../get-next-recurrence-occurrence/get-next-recurrence-occurrence.md)
- [`getPreviousRecurrenceOccurrence`](../get-previous-recurrence-occurrence/get-previous-recurrence-occurrence.md)
- [`isValidRecurrenceRule`](../is-valid-recurrence-rule/is-valid-recurrence-rule.md)
