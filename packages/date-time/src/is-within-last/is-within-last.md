# `isWithinLast`

Reports whether a date is between now minus a duration and now.

## Import

```ts
import { isWithinLast } from "@sgx4u/date-time";
```

## Signature

```ts
function isWithinLast(params: IsWithinLastParams): boolean;
```

## Parameters

| Name       | Type        | Required | Default | Meaning                                         |
| ---------- | ----------- | -------- | ------- | ----------------------------------------------- |
| `date`     | `DateInput` | yes      |         | The date to test.                               |
| `duration` | `Duration`  | yes      |         | How far back to look. It must not be negative.  |
| `now`      | `DateInput` | no       |         | The instant to use instead of the current time. |
| `timeZone` | `string`    | no       |         | Zone used when calendar units move the window.  |

## Examples

```ts
import { isWithinLast } from "@sgx4u/date-time";

isWithinLast({
    date: "2025-12-31T12:00:00Z",
    duration: { days: 1 },
    now: "2026-01-01T00:00:00Z",
    timeZone: "UTC",
});
// true

isWithinLast({
    date: "2026-01-01T00:00:00Z",
    duration: { days: 1 },
    now: "2026-01-01T00:00:00Z",
    timeZone: "UTC",
});
// true

isWithinLast({
    date: "2025-12-30T00:00:00Z",
    duration: { days: 1 },
    now: "2026-01-01T00:00:00Z",
    timeZone: "UTC",
});
// false
```

## Edge cases

Both ends are included. Calendar units in the duration are applied in `timeZone`. A negative duration throws a `RangeError`.

## Related

- [`isWithinNext`](../is-within-next/is-within-next.md)
- [`isPast`](../is-past/is-past.md)
- [`isYesterday`](../is-yesterday/is-yesterday.md)
