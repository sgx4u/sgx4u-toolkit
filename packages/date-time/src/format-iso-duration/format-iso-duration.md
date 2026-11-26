# `formatISODuration`

Formats a duration as an ISO 8601 duration.

## Import

```ts
import { formatISODuration } from "@sgx4u/date-time";
```

## Signature

```ts
function formatISODuration(duration: Duration): string | undefined;
```

## Parameters

| Name       | Type       | Required | Default | Meaning                 |
| ---------- | ---------- | -------- | ------- | ----------------------- |
| `duration` | `Duration` | yes      |         | The duration to format. |

## Examples

```ts
formatISODuration({ hours: 1, minutes: 30 });
// "PT1H30M"

formatISODuration({});
// "PT0S"

formatISODuration({ days: -1, hours: -2 });
// "-P1DT2H"

formatISODuration({ years: 1, months: 2, days: 29 });
// "P1Y2M29D"
```

## Edge cases

A zero duration is `PT0S`. One week is `P1W`. `1` second and `250` milliseconds is `PT1.25S`. Mixed signs throw `RangeError`. A value that is not a duration throws `TypeError`.

## Related

- [`parseISODuration`](../parse-iso-duration/parse-iso-duration.md) reads an ISO 8601 duration.
- [`formatDuration`](../format-duration/format-duration.md) writes the duration for people.
