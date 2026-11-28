# `parseNaturalDateRange`

Parses an English date range into a half-open interval.

## Import

```ts
import { parseNaturalDateRange } from "@sgx4u/date-time/natural-language";
```

## Signature

```ts
function parseNaturalDateRange(
    params: ParseNaturalDateRangeParams,
): Interval | undefined;
```

## Parameters

| Name           | Type        | Required | Default                                  | Meaning                                                      |
| -------------- | ----------- | -------- | ---------------------------------------- | ------------------------------------------------------------ |
| `text`         | `string`    | yes      |                                          | The English phrase.                                          |
| `preferFuture` | `boolean`   | no       | `true`                                   | A month and day with no year resolve to the next occurrence. |
| `now`          | `DateInput` | no       | `Date.now()`, read on each call.         | The instant to use instead of the current time.              |
| `timeZone`     | `string`    | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset           |

## Examples

```ts
const now = { now: "2026-11-26T12:00:00Z", timeZone: "UTC" };

parseNaturalDateRange({ text: "next week", ...now })?.start.toISOString();
// "2026-11-30T00:00:00.000Z"

parseNaturalDateRange({ text: "next week", ...now })?.end.toISOString();
// "2026-12-07T00:00:00.000Z"

parseNaturalDateRange({ text: "Dec 24-26", ...now })?.end.toISOString();
// "2026-12-27T00:00:00.000Z"

parseNaturalDateRange({ text: "tomorrow", ...now });
// undefined
```

## Edge cases

A phrase that is not a range returns `undefined`. A single day such as `tomorrow` returns `undefined`. Recognized ranges include `from Monday to Wednesday`, `Dec 24-26`, `this weekend`, and `next week`. The interval is half-open and includes the last named day, so the end is midnight at the start of the following day. A value that is not a string throws `TypeError`. An unusable `timeZone` throws `RangeError`.

Each boundary is local midnight, using compatible disambiguation. A skipped midnight moves forward by the daylight-saving gap. Around the 2024 spring-forward in `America/New_York`, `this weekend` with `now` of `2024-03-10T06:00:00Z` starts at `2024-03-09T05:00:00.000Z` and ends at `2024-03-11T04:00:00.000Z`.

## Related

- [`parseNaturalDate`](../parse-natural-date/parse-natural-date.md) parses one English date phrase.
- [`createInterval`](../create-interval/create-interval.md) builds a half-open interval from two instants.
- [`isWithinInterval`](../is-within-interval/is-within-interval.md) tests whether a date falls inside an interval.
