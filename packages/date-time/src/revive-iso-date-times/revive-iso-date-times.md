# `reviveIsoDateTimes`

Turns strict ISO date-times into dates while `JSON.parse` walks a value.

## Import

```ts
import { reviveIsoDateTimes } from "@sgx4u/date-time";
```

## Signature

```ts
function reviveIsoDateTimes(_key: string, value: unknown): unknown;
```

## Options

This function has no options.

## Examples

```ts
JSON.parse('"2026-11-26T03:30:00+05:30"', reviveIsoDateTimes);
// a Date at 2026-11-25T22:00:00.000Z

JSON.parse('"2026-11-26T00:00:00.123Z"', reviveIsoDateTimes);
// a Date at 2026-11-26T00:00:00.123Z

JSON.parse('"2026-11-26"', reviveIsoDateTimes);
// "2026-11-26"

JSON.parse('{"at":"2024-02-29T00:00:00Z","name":"leap"}', reviveIsoDateTimes);
// { at: a Date at 2024-02-29T00:00:00.000Z, name: "leap" }
```

## Edge cases

A string becomes a `Date` when it is a date-time with an offset, including `Z`. A date-only string, a date-time with no offset, an impossible day such as `2024-02-30T00:00:00Z`, and every non-string value are returned unchanged. The object key is ignored. The offset in the text places the instant.

## Related

- [`parseIsoDateTime`](../parse-iso-date-time/parse-iso-date-time.md) parses one ISO date-time and returns `undefined` when the text does not match.
- [`parseIsoDate`](../parse-iso-date/parse-iso-date.md) parses a calendar date as midnight in a zone.
