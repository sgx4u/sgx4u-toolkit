# `findDatesInText`

Finds English date phrases in a longer text and returns each match with its index.

## Import

```ts
import { findDatesInText } from "@sgx4u/date-time/natural-language";
```

## Signature

```ts
function findDatesInText(
    text: string,
    options?: ParseNaturalDateOptions,
): FoundDate[];
```

## Options

| Name           | Type        | Default      | Meaning                                                |
| -------------- | ----------- | ------------ | ------------------------------------------------------ |
| `now`          | `DateInput` | Current time | Instant used to resolve relative phrases.              |
| `timeZone`     | `string`    | System zone  | Zone used for calendar dates in the text.              |
| `preferFuture` | `boolean`   | `true`       | A month and day with no year uses the next occurrence. |

## Examples

```ts
const tomorrow = findDatesInText("See you tomorrow", {
    now: "2026-11-26T12:00:00Z",
    timeZone: "UTC",
});
tomorrow[0]?.text; // "tomorrow"
tomorrow[0]?.index; // 8
tomorrow[0]?.start.toISOString(); // "2026-11-27T00:00:00.000Z"

findDatesInText("Dec 25", {
    now: "2026-12-26T00:00:00Z",
    timeZone: "UTC",
})[0]?.start.toISOString();
// "2027-12-25T00:00:00.000Z"

findDatesInText("Dec 25", {
    now: "2026-12-26T00:00:00Z",
    timeZone: "UTC",
    preferFuture: false,
})[0]?.start.toISOString();
// "2026-12-25T00:00:00.000Z"
```

`from Monday to Wednesday` with `now` at 26 November 2026 12:00 UTC has `start` `2026-11-30T00:00:00.000Z` and `end` `2026-12-03T00:00:00.000Z`.

## Edge cases

Unrecognized text returns `[]`. `text` must be a string; any other type throws `TypeError`. An invalid `now` throws `RangeError`. A date written as `YYYY-MM-DD` is midnight in `timeZone`. In `America/New_York`, `2024-03-10` starts at `2024-03-10T05:00:00.000Z` and `2024-03-11` starts at `2024-03-11T04:00:00.000Z`.

## Related

- [`parseNaturalDate`](../parse-natural-date/parse-natural-date.md) parses one English date phrase.
- [`parseNaturalDateRange`](../parse-natural-date-range/parse-natural-date-range.md) parses one English range.
