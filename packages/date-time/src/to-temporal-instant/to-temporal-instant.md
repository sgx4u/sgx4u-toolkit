# `toTemporalInstant`

Returns a Temporal instant for a date.

## Import

```ts
import { toTemporalInstant } from "@sgx4u/date-time";
```

## Signature

```ts
function toTemporalInstant(date: DateInput): TemporalInstant | undefined;
```

## Parameters

| Name   | Type        | Required | Default | Meaning                 |
| ------ | ----------- | -------- | ------- | ----------------------- |
| `date` | `DateInput` | yes      |         | The instant to convert. |

## Examples

```ts
toTemporalInstant(0).epochMilliseconds;
// 0

toTemporalInstant(-1500).epochMilliseconds;
// -1500

toTemporalInstant("2024-02-29T00:00:00.000Z").epochMilliseconds;
// 1709164800000
```

## Edge cases

The call uses `Temporal.Instant.fromEpochMilliseconds` on the global object. When that function is missing, the call throws `TypeError`. An invalid date throws `RangeError` once Temporal is present. A `Date`, a millisecond timestamp, and an ISO date-time with an offset are the same instant. The returned object exposes `epochMilliseconds`.

## Related

- [`fromTemporal`](../from-temporal/from-temporal.md) returns a `Date` from a Temporal instant.
- [`toUnixSeconds`](../to-unix-seconds/to-unix-seconds.md) returns whole Unix seconds.
- [`toDate`](../to-date/to-date.md) returns a `Date` for the same inputs.
