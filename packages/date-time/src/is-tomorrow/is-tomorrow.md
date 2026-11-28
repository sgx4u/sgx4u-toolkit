# `isTomorrow`

Reports whether a date falls on the calendar day after today.

## Import

```ts
import { isTomorrow } from "@sgx4u/date-time";
```

## Signature

```ts
function isTomorrow(params: IsTomorrowParams): boolean;
```

## Parameters

| Name       | Type        | Required | Default | Meaning                                         |
| ---------- | ----------- | -------- | ------- | ----------------------------------------------- |
| `date`     | `DateInput` | yes      |         | The date to test.                               |
| `now`      | `DateInput` | no       |         | The instant to use instead of the current time. |
| `timeZone` | `string`    | no       |         | Zone used to read calendar days.                |

## Examples

```ts
import { isTomorrow } from "@sgx4u/date-time";

isTomorrow({
    date: "2026-11-27T00:00:00Z",
    now: "2026-11-26T00:00:00Z",
    timeZone: "UTC",
});
// true

isTomorrow({
    date: "2026-11-27T20:00:00Z",
    now: "2026-11-26T20:00:00Z",
    timeZone: "Asia/Kolkata",
});
// true

isTomorrow({
    date: "2026-11-26T20:00:00Z",
    now: "2026-11-26T20:00:00Z",
    timeZone: "Asia/Kolkata",
});
// false
```

## Edge cases

Tomorrow is the next calendar day in `timeZone`, not a 24-hour offset. An instant equal to `now` is today, not tomorrow. A value that is not a real date returns `undefined`.

## Related

- [`isToday`](../is-today/is-today.md)
- [`isYesterday`](../is-yesterday/is-yesterday.md)
- [`isWithinNext`](../is-within-next/is-within-next.md)
