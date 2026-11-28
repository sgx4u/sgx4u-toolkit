# `parseUTCOffset`

Parses a UTC offset into minutes east of UTC.

## Import

```ts
import { parseUTCOffset } from "@sgx4u/date-time";
```

## Signature

```ts
function parseUTCOffset(value: string): number | undefined;
```

## Parameters

| Name    | Type     | Required | Default | Meaning             |
| ------- | -------- | -------- | ------- | ------------------- |
| `value` | `string` | yes      |         | The candidate text. |

## Examples

```ts
parseUTCOffset("Z");
// 0

parseUTCOffset("+05:30");
// 330

parseUTCOffset("+05");
// 300

parseUTCOffset("-08:00");
// -480
```

## Edge cases

Text that does not match returns `undefined`. Accepted forms are `Z`, `z`, `±HH:mm`, `±HHmm`, and `±HH`. `+5:30`, a bare `05:30`, `UTC`, and an hour or minute past the clock range return `undefined`. A value that is not a string throws `TypeError`. The result is a fixed number of minutes east of UTC.

## Related

- [`formatUTCOffset`](../format-utc-offset/format-utc-offset.md) writes minutes as offset text.
- [`getUTCOffset`](../get-utc-offset/get-utc-offset.md) reads the offset of an instant in a zone.
