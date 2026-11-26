# `isAfter`

Reports whether a date is strictly later than a reference.

## Import

```ts
import { isAfter } from "@sgx4u/date-time";
```

## Signature

```ts
function isAfter(date: DateInput, reference: DateInput): boolean;
```

## Options

This function has no options.

## Examples

```ts
import { isAfter } from "@sgx4u/date-time";

isAfter("2024-01-02T00:00:00Z", "2024-01-01T00:00:00Z");
// true

isAfter("2024-01-01T00:00:00Z", "2024-01-01T00:00:00Z");
// false

isAfter("2024-01-01T00:00:00Z", "2024-01-02T00:00:00Z");
// false
```

## Edge cases

Equal instants return `false`. A value that is not a real date throws a `RangeError` instead of returning `false`.

## Related

- [`isBefore`](../is-before/is-before.md)
- [`isBetween`](../is-between/is-between.md)
- [`isSameInstant`](../is-same-instant/is-same-instant.md)
