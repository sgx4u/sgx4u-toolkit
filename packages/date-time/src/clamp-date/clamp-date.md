# `clampDate`

Limits a date to an inclusive range and returns a new `Date`.

## Import

```ts
import { clampDate } from "@sgx4u/date-time";
```

## Signature

```ts
function clampDate(params: ClampDateParams): Date | undefined;
```

## Parameters

| Name    | Type        | Required | Default | Meaning                       |
| ------- | ----------- | -------- | ------- | ----------------------------- |
| `date`  | `DateInput` | yes      |         | The date to limit.            |
| `start` | `DateInput` | yes      |         | Inclusive start of the range. |
| `end`   | `DateInput` | yes      |         | Inclusive end of the range.   |

## Examples

```ts
clampDate({
    date: "2024-01-10T00:00:00Z",
    start: "2024-01-01T00:00:00Z",
    end: "2024-01-05T00:00:00Z",
})?.toISOString();
// "2024-01-05T00:00:00.000Z"
```

## Edge cases

`start` after `end` throws `RangeError`. A value that is not a real date returns `undefined`. The inputs are not mutated. A date already inside the range is returned as its own instant.

## Related

- [`isWithinInterval`](../is-within-interval/is-within-interval.md) tests a half-open interval.
- [`compareDates`](../compare-dates/compare-dates.md) orders two instants.
