# `isFuture`

Reports whether a date is strictly after now.

## Import

```ts
import { isFuture } from "@sgx4u/date-time";
```

## Signature

```ts
function isFuture(date: DateInput, options?: NowOptions): boolean;
```

## Options

| Name  | Type        | Default                         | Meaning                                         |
| ----- | ----------- | ------------------------------- | ----------------------------------------------- |
| `now` | `DateInput` | `Date.now()`, read on each call | The instant to use instead of the current time. |

## Examples

```ts
import { isFuture } from "@sgx4u/date-time";

isFuture("2027-01-01T00:00:00Z", { now: "2026-01-01T00:00:00Z" });
// true

isFuture("2026-01-01T00:00:00Z", { now: "2026-01-01T00:00:00Z" });
// false

isFuture("2025-01-01T00:00:00Z", { now: "2026-01-01T00:00:00Z" });
// false
```

## Edge cases

Equal to `now` returns `false`. `now` defaults to the current time, read on each call. A value that is not a real date throws a `RangeError`.

## Related

- [`isPast`](../is-past/is-past.md)
- [`isWithinNext`](../is-within-next/is-within-next.md)
- [`getRelativeTimeParts`](../get-relative-time-parts/get-relative-time-parts.md)
