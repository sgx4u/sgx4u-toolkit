# `parseDurationText`

Parses English duration text.

## Import

```ts
import { parseDurationText } from "@sgx4u/date-time";
```

## Signature

```ts
function parseDurationText(value: string): Duration | undefined;
```

## Options

This function has no options.

## Examples

```ts
parseDurationText("1h 30m");
// { hours: 1, minutes: 30 }

parseDurationText("2 days 3 hours");
// { days: 2, hours: 3 }

parseDurationText("-1.5 hours");
// { hours: -1.5 }

parseDurationText("1:30:00");
// { hours: 1, minutes: 30, seconds: 0 }
```

## Edge cases

Text that does not match returns `undefined`, including an empty string and a phrase with no known unit. Units may repeat and may appear in any order. A leading `-` negates every field. `H:mm:ss` and `mm:ss` are accepted. A fraction is allowed on a clock field when that field is the smallest non-zero one. A fraction on a calendar field returns `undefined`. A value that is not a string throws `TypeError`.

## Related

- [`parseIsoDuration`](../parse-iso-duration/parse-iso-duration.md) reads an ISO 8601 duration.
- [`formatDuration`](../format-duration/format-duration.md) writes a duration as words.
- [`formatDurationCompact`](../format-duration-compact/format-duration-compact.md) writes compact unit symbols.
