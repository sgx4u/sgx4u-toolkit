# `parseIsoDuration`

Parses an ISO 8601 duration such as `P1Y2M3DT4H5M6.5S`.

## Import

```ts
import { parseIsoDuration } from "@sgx4u/date-time";
```

## Signature

```ts
function parseIsoDuration(value: string): Duration | undefined;
```

## Options

This function has no options.

## Examples

```ts
parseIsoDuration("PT1H30M");
// { hours: 1, minutes: 30 }

parseIsoDuration("P1Y2M3DT4H5M6.5S");
// { years: 1, months: 2, days: 3, hours: 4, minutes: 5, seconds: 6.5 }

parseIsoDuration("-P1D");
// { days: -1 }

parseIsoDuration("P");
// undefined
```

## Edge cases

Text that does not match returns `undefined`. `P`, `PT`, `-P`, and `-PT` are empty and return `undefined`. A fraction is allowed only on the last component, so `P1.5YT1H` returns `undefined`. A leading `-` negates every field. A value that is not a string throws `TypeError`.

## Related

- [`formatIsoDuration`](../format-iso-duration/format-iso-duration.md) writes a duration as ISO 8601 text.
- [`parseDurationText`](../parse-duration-text/parse-duration-text.md) reads English duration text.
- [`addDuration`](../add-duration/add-duration.md) adds the parsed duration to a date.
