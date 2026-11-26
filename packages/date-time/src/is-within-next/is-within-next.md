# `isWithinNext`

Reports whether a date is between now and now plus a duration.

## Import

```ts
import { isWithinNext } from "@sgx4u/date-time";
```

## Signature

```ts
function isWithinNext(params: IsWithinNextParams): boolean;
```

## Parameters

| Name       | Type        | Required | Default | Meaning                                         |
| ---------- | ----------- | -------- | ------- | ----------------------------------------------- |
| `date`     | `DateInput` | yes      |         | The date to test.                               |
| `duration` | `Duration`  | yes      |         | How far ahead to look. It must not be negative. |
| `now`      | `DateInput` | no       |         | The instant to use instead of the current time. |
| `timeZone` | `string`    | no       |         | Zone used when calendar units move the window.  |

## Examples

```ts
import { isWithinNext } from "@sgx4u/date-time";

isWithinNext({
    date: "2026-01-01T12:00:00Z",
    duration: { hours: 24 },
    now: "2026-01-01T00:00:00Z",
    timeZone: "UTC",
});
// true

isWithinNext({
    date: "2026-01-02T00:00:00Z",
    duration: { hours: 24 },
    now: "2026-01-01T00:00:00Z",
    timeZone: "UTC",
});
// true

isWithinNext({
    date: "2026-01-02T00:00:00.001Z",
    duration: { hours: 24 },
    now: "2026-01-01T00:00:00Z",
    timeZone: "UTC",
});
// false
```

## Edge cases

Both ends are included. Calendar units in the duration are applied in `timeZone`. A negative duration throws a `RangeError`.

## Related

- [`isWithinLast`](../is-within-last/is-within-last.md)
- [`isFuture`](../is-future/is-future.md)
- [`isTomorrow`](../is-tomorrow/is-tomorrow.md)
