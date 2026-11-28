# `compareDurations`

Compares two durations by their length in milliseconds.

## Import

```ts
import { compareDurations } from "@sgx4u/date-time";
```

## Signature

```ts
function compareDurations(
    params: CompareDurationsParams,
): -1 | 0 | 1 | undefined;
```

## Parameters

| Name         | Type        | Required | Default                                  | Meaning                                                    |
| ------------ | ----------- | -------- | ---------------------------------------- | ---------------------------------------------------------- |
| `first`      | `Duration`  | yes      |                                          | The first duration.                                        |
| `second`     | `Duration`  | yes      |                                          | The second duration.                                       |
| `relativeTo` | `DateInput` | no       |                                          | The instant used when either duration has months or years. |
| `timeZone`   | `string`    | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset         |

## Examples

```ts
compareDurations({ first: { hours: 2 }, second: { minutes: 90 } });
// 1

compareDurations({
    first: { months: 1 },
    second: { days: 29 },
    relativeTo: "2024-01-31T00:00:00Z",
    timeZone: "UTC",
});
// 0
```

## Edge cases

Months or years without `relativeTo` throw `RangeError`. A bad duration or `relativeTo` returns `undefined`. One calendar day can be shorter than 24 elapsed hours across a daylight-saving gap when `relativeTo` is set.

## Related

- [`durationToMilliseconds`](../duration-to-milliseconds/duration-to-milliseconds.md) measures one duration.
- [`addDurations`](../add-durations/add-durations.md) adds two durations field by field.
