# `parseNaturalDate`

Parses an English date such as `tomorrow`, `next Friday at 4pm`, `in 3 days`, or `Dec 25`.

## Import

```ts
import { parseNaturalDate } from "@sgx4u/date-time/natural-language";
```

## Examples

With `now` at 26 November 2026 12:00 UTC, `tomorrow` is 27 November and `next Friday at 4pm` is 4 December at 16:00. `this weekend` starts on Saturday 28 November.

## Edge cases

Unrecognized text returns `undefined`, and `findDatesInText` returns `[]`. A month and day with no year uses the next occurrence when `preferFuture` is true. `next Friday` is the Friday of the following week, while a bare weekday is the next one from today.

## Related

- [`parseNaturalDate`](../parse-natural-date/parse-natural-date.md)
