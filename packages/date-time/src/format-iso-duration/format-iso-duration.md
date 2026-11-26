# `formatIsoDuration`

Formats a duration as an ISO 8601 duration.

## Import

```ts
import { formatIsoDuration } from "@sgx4u/date-time";
```

## Signature

```ts
function formatIsoDuration(duration: Duration): string;
```

## Options

This function has no options.

## Examples

```ts
formatIsoDuration({ hours: 1, minutes: 30 });
// "PT1H30M"

formatIsoDuration({});
// "PT0S"

formatIsoDuration({ days: -1, hours: -2 });
// "-P1DT2H"

formatIsoDuration({ years: 1, months: 2, days: 29 });
// "P1Y2M29D"
```

## Edge cases

A zero duration is `PT0S`. One week is `P1W`. `1` second and `250` milliseconds is `PT1.25S`. Mixed signs throw `RangeError`. A value that is not a duration throws `TypeError`.

## Related

- [`parseIsoDuration`](../parse-iso-duration/parse-iso-duration.md) reads an ISO 8601 duration.
- [`formatDuration`](../format-duration/format-duration.md) writes the duration for people.
