# `isBetween`

Reports whether a date lies between two ends.

## Import

```ts
import { isBetween } from "@sgx4u/date-time";
```

## Signature

```ts
function isBetween(
    date: DateInput,
    start: DateInput,
    end: DateInput,
    options?: IsBetweenOptions,
): boolean;
```

## Options

| Name           | Type      | Default | Meaning                                  |
| -------------- | --------- | ------- | ---------------------------------------- |
| `includeStart` | `boolean` | `true`  | Whether the start instant itself counts. |
| `includeEnd`   | `boolean` | `true`  | Whether the end instant itself counts.   |

## Examples

```ts
import { isBetween } from "@sgx4u/date-time";

isBetween(
    "2024-01-02T00:00:00Z",
    "2024-01-01T00:00:00Z",
    "2024-01-03T00:00:00Z",
);
// true

isBetween(
    "2024-01-01T00:00:00Z",
    "2024-01-01T00:00:00Z",
    "2024-01-03T00:00:00Z",
    { includeStart: false },
);
// false

isBetween(
    "2024-01-02T00:00:00Z",
    "2024-01-03T00:00:00Z",
    "2024-01-01T00:00:00Z",
);
// false
```

## Edge cases

Both ends are included unless the matching option is `false`. When `start` is after `end`, no instant is inside the range. A value that is not a real date throws a `RangeError`.

## Related

- [`isAfter`](../is-after/is-after.md)
- [`isBefore`](../is-before/is-before.md)
- [`isWithinInterval`](../is-within-interval/is-within-interval.md)
