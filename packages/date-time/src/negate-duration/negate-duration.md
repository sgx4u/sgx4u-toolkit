# `negateDuration`

Returns a duration with every field's sign flipped.

## Import

```ts
import { negateDuration } from "@sgx4u/date-time";
```

## Signature

```ts
function negateDuration(duration: Duration): Duration | undefined;
```

## Parameters

| Name       | Type       | Required | Default | Meaning                 |
| ---------- | ---------- | -------- | ------- | ----------------------- |
| `duration` | `Duration` | yes      |         | The duration to negate. |

## Examples

```ts
import { negateDuration } from "@sgx4u/date-time";

negateDuration({ hours: 2 });
// { hours: -2 }

negateDuration({ hours: -2, minutes: -30 });
// { hours: 2, minutes: 30 }

negateDuration({ hours: 0 });
// { hours: 0 }
```

## Edge cases

Zero fields stay zero. The input is not changed. A value that is not a valid duration throws a `RangeError`. Fields must already share one sign.

## Related

- [`millisecondsToDuration`](../milliseconds-to-duration/milliseconds-to-duration.md)
- [`isValidDuration`](../is-valid-duration/is-valid-duration.md)
- [`getAgeAsDuration`](../get-age-as-duration/get-age-as-duration.md)
