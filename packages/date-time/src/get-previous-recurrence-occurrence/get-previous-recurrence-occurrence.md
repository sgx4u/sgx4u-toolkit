# `getPreviousRecurrenceOccurrence`

Returns the previous occurrence of a recurrence rule.

## Import

```ts
import { getPreviousRecurrenceOccurrence } from "@sgx4u/date-time/recurrence";
```

## Signature

```ts
function getPreviousRecurrenceOccurrence(
    rule: RecurrenceRule,
    options?: AdjacentRecurrenceOptions,
): Date | undefined;
```

## Options

| Name         | Type        | Default                         | Meaning                                         |
| ------------ | ----------- | ------------------------------- | ----------------------------------------------- |
| `now`        | `DateInput` | `Date.now()`, read on each call | The instant to use instead of the current time. |
| `includeNow` | `boolean`   | `false`                         | Whether an occurrence at `now` counts.          |

## Examples

```ts
import { getPreviousRecurrenceOccurrence } from "@sgx4u/date-time/recurrence";

getPreviousRecurrenceOccurrence(
    { start: new Date("2026-11-26T09:00:00Z"), frequency: "daily" },
    { now: "2026-11-28T09:00:00Z" },
)?.toISOString();
// "2026-11-27T09:00:00.000Z"

getPreviousRecurrenceOccurrence(
    { start: new Date("2026-11-26T09:00:00Z"), frequency: "daily" },
    { now: "2026-11-27T09:00:00Z", includeNow: true },
)?.toISOString();
// "2026-11-27T09:00:00.000Z"

getPreviousRecurrenceOccurrence(
    { start: new Date("2026-11-26T09:00:00Z"), frequency: "daily" },
    { now: "2026-11-26T09:00:00Z" },
)?.toISOString();
// undefined
```

## Edge cases

`includeNow` defaults to `false`, so an occurrence at `now` is skipped and the previous one is returned. The result is `undefined` when nothing in the rule falls before `now`, which includes the start instant itself when `includeNow` is `false`. A floating rule is evaluated in UTC.

## Related

- [`getNextRecurrenceOccurrence`](../get-next-recurrence-occurrence/get-next-recurrence-occurrence.md)
- [`listRecurrenceOccurrences`](../list-recurrence-occurrences/list-recurrence-occurrences.md)
- [`isValidRecurrenceRule`](../is-valid-recurrence-rule/is-valid-recurrence-rule.md)
