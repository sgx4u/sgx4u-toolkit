# `getNextRecurrenceOccurrence`

Returns the next occurrence of a recurrence rule.

## Import

```ts
import { getNextRecurrenceOccurrence } from "@sgx4u/date-time/recurrence";
```

## Signature

```ts
function getNextRecurrenceOccurrence(
    params: GetNextRecurrenceOccurrenceParams,
): Date | undefined;
```

## Parameters

| Name         | Type             | Required | Default                          | Meaning                                         |
| ------------ | ---------------- | -------- | -------------------------------- | ----------------------------------------------- |
| `rule`       | `RecurrenceRule` | yes      |                                  | The recurrence rule.                            |
| `includeNow` | `boolean`        | no       | `false`                          | Whether an occurrence exactly at `now` counts.  |
| `now`        | `DateInput`      | no       | `Date.now()`, read on each call. | The instant to use instead of the current time. |

## Examples

```ts
import { getNextRecurrenceOccurrence } from "@sgx4u/date-time/recurrence";

getNextRecurrenceOccurrence({
    rule: { start: new Date("2026-11-26T09:00:00Z"), frequency: "daily" },
    now: "2026-11-26T09:00:00Z",
})?.toISOString();
// "2026-11-27T09:00:00.000Z"

getNextRecurrenceOccurrence({
    rule: { start: new Date("2026-11-26T09:00:00Z"), frequency: "daily" },
    now: "2026-11-26T09:00:00Z",
    includeNow: true,
})?.toISOString();
// "2026-11-26T09:00:00.000Z"

getNextRecurrenceOccurrence({
    rule: {
        start: new Date("2026-11-26T09:00:00Z"),
        frequency: "daily",
        count: 1,
    },
    now: "2026-11-27T09:00:00Z",
})?.toISOString();
// undefined
```

## Edge cases

`includeNow` defaults to `false`, so an occurrence at `now` is skipped. The result is `undefined` when the rule has no occurrence ahead, including after `count` or `until`. A floating rule, one without `timeZone`, is evaluated in UTC.

## Related

- [`getPreviousRecurrenceOccurrence`](../get-previous-recurrence-occurrence/get-previous-recurrence-occurrence.md)
- [`listRecurrenceOccurrences`](../list-recurrence-occurrences/list-recurrence-occurrences.md)
- [`isValidRecurrenceRule`](../is-valid-recurrence-rule/is-valid-recurrence-rule.md)
