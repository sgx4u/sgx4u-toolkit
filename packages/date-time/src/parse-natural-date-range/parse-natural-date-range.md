# `parseNaturalDateRange`

Parses an English range such as `from Monday to Wednesday`, `this weekend`, or `Dec 24-26`.

## Import

```ts
import { parseNaturalDateRange } from "@sgx4u/date-time/natural-language";
```

## Examples

With `now` at 26 November 2026 12:00 UTC, `tomorrow` is 27 November and `next Friday at 4pm` is 4 December at 16:00. `this weekend` starts on Saturday 28 November.

## Edge cases

Unrecognized text returns `undefined`, and `findDatesInText` returns `[]`. A month and day with no year uses the next occurrence when `preferFuture` is true. `next Friday` is the Friday of the following week, while a bare weekday is the next one from today.

## Related

- [`parseNaturalDate`](../parse-natural-date/parse-natural-date.md)
