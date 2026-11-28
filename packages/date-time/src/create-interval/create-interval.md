# `createInterval`

Builds a half-open interval `[start, end)`.

## Import

```ts
import { createInterval } from "@sgx4u/date-time";
```

## Signature

```ts
function createInterval(params: CreateIntervalParams): Interval | undefined;
```

## Parameters

| Name    | Type        | Required | Default | Meaning                                         |
| ------- | ----------- | -------- | ------- | ----------------------------------------------- |
| `start` | `DateInput` | yes      |         | The first instant, included.                    |
| `end`   | `DateInput` | yes      |         | The instant where the interval stops, excluded. |

## Examples

```ts
const interval = createInterval({
    start: "2026-01-01T00:00:00Z",
    end: "2026-01-02T00:00:00Z",
});
interval?.start.toISOString(); // "2026-01-01T00:00:00.000Z"
```

## Edge cases

`start` equal to `end` is empty and valid. `end` before `start` or a side that is not a real date returns `undefined`. The returned `Date` objects are new; the inputs are not mutated.

## Related

- [`isValidInterval`](../is-valid-interval/is-valid-interval.md) reports whether an interval is usable.
- [`isWithinInterval`](../is-within-interval/is-within-interval.md) tests an instant against `[start, end)`.
