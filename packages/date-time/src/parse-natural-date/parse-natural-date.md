# `parseNaturalDate`

Parses an English date phrase.

## Import

```ts
import { parseNaturalDate } from "@sgx4u/date-time/natural-language";
```

## Signature

```ts
function parseNaturalDate(params: ParseNaturalDateParams): Date | undefined;
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

parseNaturalDate({ text: "tomorrow", ...now })?.toISOString();
// "2026-11-27T00:00:00.000Z"

parseNaturalDate({ text: "in 3 days", ...now })?.toISOString();
// "2026-11-29T12:00:00.000Z"

parseNaturalDate({ text: "next Friday at 4pm", ...now })?.toISOString();
// "2026-12-04T16:00:00.000Z"

parseNaturalDate({ text: "not a date", ...now });
// undefined
```

## Edge cases

A phrase that is not recognized returns `undefined`. Recognized phrases include `now`, `today`, `tomorrow`, `yesterday`, `tonight`, `next Friday`, `in 3 days`, `3 weeks ago`, `a month from now`, `Dec 25`, `25 December 2026`, `2026-11-26`, and times such as `5pm`, `17:30`, `noon`, and `midnight`. A named day with no time is midnight in `timeZone`. A relative length such as `in 3 days` keeps the time of `now`. With `preferFuture: false`, a month and day with no year resolve to the most recent occurrence. A value that is not a string throws `TypeError`. An unusable `timeZone` throws `RangeError`.

Wall times use compatible disambiguation. A daylight-saving gap that skips the chosen clock time moves forward by the gap, and a repeated time keeps the earlier instant. In `America/Santiago`, midnight on 2024-09-08 is `2024-09-08T04:00:00.000Z`.

## Related

- [`parseNaturalDateRange`](../parse-natural-date-range/parse-natural-date-range.md) parses an English range.
- [`findDatesInText`](../find-dates-in-text/find-dates-in-text.md) finds date phrases inside a longer text.
