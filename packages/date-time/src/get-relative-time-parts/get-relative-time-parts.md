# `getRelativeTimeParts`

Returns the signed relative-time value and the unit that was chosen.

## Import

```ts
import { getRelativeTimeParts } from "@sgx4u/date-time";
```

## Signature

```ts
function getRelativeTimeParts(
    params: GetRelativeTimePartsParams,
): RelativeTimeParts | undefined;
```

## Parameters

| Name   | Type                 | Required | Default                          | Meaning                                                                              |
| ------ | -------------------- | -------- | -------------------------------- | ------------------------------------------------------------------------------------ |
| `date` | `DateInput`          | yes      |                                  | The date to describe.                                                                |
| `unit` | `"auto" \| TimeUnit` | no       | `"auto"`                         | `"auto"` picks the unit from the elapsed time. Weeks are never chosen automatically. |
| `now`  | `DateInput`          | no       | `Date.now()`, read on each call. | The instant to use instead of the current time.                                      |

## Examples

```ts
import { getRelativeTimeParts } from "@sgx4u/date-time";

getRelativeTimeParts({
    date: "2026-01-01T03:00:00Z",
    now: "2026-01-01T00:00:00Z",
});
// { value: 3, unit: "hour" }

getRelativeTimeParts({
    date: "2026-01-01T00:00:00Z",
    now: "2026-01-01T03:00:00Z",
});
// { value: -3, unit: "hour" }

getRelativeTimeParts({
    date: "2026-01-08T00:00:00Z",
    now: "2026-01-01T00:00:00Z",
    unit: "week",
});
// { value: 1, unit: "week" }
```

## Edge cases

Negative means the past. `"auto"` never chooses weeks; pass `unit: "week"` to count weeks. An unknown unit throws a `RangeError`. The comparison is elapsed time, not a calendar-day name.

## Related

- [`getCountdownParts`](../get-countdown-parts/get-countdown-parts.md)
- [`isPast`](../is-past/is-past.md)
- [`isFuture`](../is-future/is-future.md)
