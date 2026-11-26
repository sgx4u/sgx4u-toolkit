# `isBefore`

Reports whether a date is strictly earlier than a reference.

## Import

```ts
import { isBefore } from "@sgx4u/date-time";
```

## Signature

```ts
function isBefore(date: DateInput, reference: DateInput): boolean;
```

## Options

This function has no options.

## Examples

```ts
import { isBefore } from "@sgx4u/date-time";

isBefore("2024-01-01T00:00:00Z", "2024-01-02T00:00:00Z");
// true

isBefore("2024-01-01T00:00:00Z", "2024-01-01T00:00:00Z");
// false

isBefore("2024-01-02T00:00:00Z", "2024-01-01T00:00:00Z");
// false
```

## Edge cases

Equal instants return `false`. A value that is not a real date throws a `RangeError`. It is not treated as "not before".

## Related

- [`isAfter`](../is-after/is-after.md)
- [`isBetween`](../is-between/is-between.md)
- [`isSameInstant`](../is-same-instant/is-same-instant.md)
