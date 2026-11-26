# `parseUtcOffset`

Parses a UTC offset into minutes east of UTC.

## Import

```ts
import { parseUtcOffset } from "@sgx4u/date-time";
```

## Signature

```ts
function parseUtcOffset(value: string): number | undefined;
```

## Options

This function has no options.

## Examples

```ts
parseUtcOffset("Z");
// 0

parseUtcOffset("+05:30");
// 330

parseUtcOffset("+05");
// 300

parseUtcOffset("-08:00");
// -480
```

## Edge cases

Text that does not match returns `undefined`. Accepted forms are `Z`, `z`, `±HH:mm`, `±HHmm`, and `±HH`. `+5:30`, a bare `05:30`, `UTC`, and an hour or minute past the clock range return `undefined`. A value that is not a string throws `TypeError`. The result is a fixed number of minutes east of UTC.

## Related

- [`formatUtcOffset`](../format-utc-offset/format-utc-offset.md) writes minutes as offset text.
- [`getUtcOffset`](../get-utc-offset/get-utc-offset.md) reads the offset of an instant in a zone.
