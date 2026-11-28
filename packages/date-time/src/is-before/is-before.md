# `isBefore`

Reports whether a date is strictly earlier than a reference.

## Import

```ts
import { isBefore } from "@sgx4u/date-time";
```

## Signature

```ts
function isBefore(params: IsBeforeParams): boolean;
```

## Parameters

| Name        | Type        | Required | Default | Meaning                   |
| ----------- | ----------- | -------- | ------- | ------------------------- |
| `date`      | `DateInput` | yes      |         | The date to test.         |
| `reference` | `DateInput` | yes      |         | The date to test against. |

## Examples

```ts
import { isBefore } from "@sgx4u/date-time";

isBefore({ date: "2024-01-01T00:00:00Z", reference: "2024-01-02T00:00:00Z" });
// true

isBefore({ date: "2024-01-01T00:00:00Z", reference: "2024-01-01T00:00:00Z" });
// false

isBefore({ date: "2024-01-02T00:00:00Z", reference: "2024-01-01T00:00:00Z" });
// false
```

## Edge cases

Equal instants return `false`. A value that is not a real date returns `undefined`. It is not treated as "not before".

## Related

- [`isAfter`](../is-after/is-after.md)
- [`isBetween`](../is-between/is-between.md)
- [`isSameInstant`](../is-same-instant/is-same-instant.md)
