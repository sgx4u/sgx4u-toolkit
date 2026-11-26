# `isBetween`

Reports whether a date lies between two ends.

## Import

```ts
import { isBetween } from "@sgx4u/date-time";
```

## Signature

```ts
function isBetween(params: IsBetweenParams): boolean;
```

## Parameters

| Name           | Type        | Required | Default | Meaning                                  |
| -------------- | ----------- | -------- | ------- | ---------------------------------------- |
| `date`         | `DateInput` | yes      |         | The date to test.                        |
| `start`        | `DateInput` | yes      |         | One end of the range.                    |
| `end`          | `DateInput` | yes      |         | The other end of the range.              |
| `includeStart` | `boolean`   | no       | `true`  | Whether the start instant itself counts. |
| `includeEnd`   | `boolean`   | no       | `true`  | Whether the end instant itself counts.   |

## Examples

```ts
import { isBetween } from "@sgx4u/date-time";

isBetween({
    date: "2024-01-02T00:00:00Z",
    start: "2024-01-01T00:00:00Z",
    end: "2024-01-03T00:00:00Z",
});
// true

isBetween({
    date: "2024-01-01T00:00:00Z",
    start: "2024-01-01T00:00:00Z",
    end: "2024-01-03T00:00:00Z",
    includeStart: false,
});
// false

isBetween({
    date: "2024-01-02T00:00:00Z",
    start: "2024-01-03T00:00:00Z",
    end: "2024-01-01T00:00:00Z",
});
// false
```

## Edge cases

Both ends are included unless the matching option is `false`. When `start` is after `end`, no instant is inside the range. A value that is not a real date returns `undefined`.

## Related

- [`isAfter`](../is-after/is-after.md)
- [`isBefore`](../is-before/is-before.md)
- [`isWithinInterval`](../is-within-interval/is-within-interval.md)
