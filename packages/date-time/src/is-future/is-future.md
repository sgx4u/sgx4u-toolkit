# `isFuture`

Reports whether a date is strictly after now.

## Import

```ts
import { isFuture } from "@sgx4u/date-time";
```

## Signature

```ts
function isFuture(params: IsFutureParams): boolean;
```

## Parameters

| Name   | Type        | Required | Default | Meaning                                         |
| ------ | ----------- | -------- | ------- | ----------------------------------------------- |
| `date` | `DateInput` | yes      |         | The date to test.                               |
| `now`  | `DateInput` | no       |         | The instant to use instead of the current time. |

## Examples

```ts
import { isFuture } from "@sgx4u/date-time";

isFuture({ date: "2027-01-01T00:00:00Z", now: "2026-01-01T00:00:00Z" });
// true

isFuture({ date: "2026-01-01T00:00:00Z", now: "2026-01-01T00:00:00Z" });
// false

isFuture({ date: "2025-01-01T00:00:00Z", now: "2026-01-01T00:00:00Z" });
// false
```

## Edge cases

Equal to `now` returns `false`. `now` defaults to the current time, read on each call. A value that is not a real date returns `undefined`.

## Related

- [`isPast`](../is-past/is-past.md)
- [`isWithinNext`](../is-within-next/is-within-next.md)
- [`getRelativeTimeParts`](../get-relative-time-parts/get-relative-time-parts.md)
