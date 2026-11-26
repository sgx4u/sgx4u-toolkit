# `isValidDuration`

Reports whether a value is a duration.

## Import

```ts
import { isValidDuration } from "@sgx4u/date-time";
```

## Signature

```ts
function isValidDuration(value: unknown): value is Duration;
```

## Options

This function has no options.

## Examples

```ts
import { isValidDuration } from "@sgx4u/date-time";

isValidDuration({ hours: 1, minutes: 30 });
// true

isValidDuration({});
// true

isValidDuration({ hours: 1, minutes: -30 });
// false

isValidDuration({ days: 1.5 });
// false
```

## Edge cases

Known fields must be finite numbers and share one sign. The empty object is a zero duration. A fraction is allowed only on the smallest non-zero clock field (`hours`, `minutes`, `seconds`, or `milliseconds`). The function does not throw.

## Related

- [`negateDuration`](../negate-duration/negate-duration.md)
- [`millisecondsToDuration`](../milliseconds-to-duration/milliseconds-to-duration.md)
- [`getIntervalDuration`](../get-interval-duration/get-interval-duration.md)
