# `isPast`

Reports whether a date is strictly before now.

## Import

```ts
import { isPast } from "@sgx4u/date-time";
```

## Signature

```ts
function isPast(params: IsPastParams): boolean;
```

## Parameters

| Name   | Type        | Required | Default | Meaning                                         |
| ------ | ----------- | -------- | ------- | ----------------------------------------------- |
| `date` | `DateInput` | yes      |         | The date to test.                               |
| `now`  | `DateInput` | no       |         | The instant to use instead of the current time. |

## Examples

```ts
import { isPast } from "@sgx4u/date-time";

isPast({ date: "2020-01-01T00:00:00Z", now: "2026-01-01T00:00:00Z" });
// true

isPast({ date: "2026-01-01T00:00:00Z", now: "2026-01-01T00:00:00Z" });
// false

isPast({ date: "2027-01-01T00:00:00Z", now: "2026-01-01T00:00:00Z" });
// false
```

## Edge cases

Equal to `now` returns `false`. `now` defaults to the current time, read on each call. A value that is not a real date returns `undefined`.

## Related

- [`isFuture`](../is-future/is-future.md)
- [`isWithinLast`](../is-within-last/is-within-last.md)
- [`getRelativeTimeParts`](../get-relative-time-parts/get-relative-time-parts.md)
