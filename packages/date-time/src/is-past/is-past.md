# `isPast`

Reports whether a date is strictly before now.

## Import

```ts
import { isPast } from "@sgx4u/date-time";
```

## Signature

```ts
function isPast(date: DateInput, options?: NowOptions): boolean;
```

## Options

| Name  | Type        | Default                         | Meaning                                         |
| ----- | ----------- | ------------------------------- | ----------------------------------------------- |
| `now` | `DateInput` | `Date.now()`, read on each call | The instant to use instead of the current time. |

## Examples

```ts
import { isPast } from "@sgx4u/date-time";

isPast("2020-01-01T00:00:00Z", { now: "2026-01-01T00:00:00Z" });
// true

isPast("2026-01-01T00:00:00Z", { now: "2026-01-01T00:00:00Z" });
// false

isPast("2027-01-01T00:00:00Z", { now: "2026-01-01T00:00:00Z" });
// false
```

## Edge cases

Equal to `now` returns `false`. `now` defaults to the current time, read on each call. A value that is not a real date throws a `RangeError`.

## Related

- [`isFuture`](../is-future/is-future.md)
- [`isWithinLast`](../is-within-last/is-within-last.md)
- [`getRelativeTimeParts`](../get-relative-time-parts/get-relative-time-parts.md)
