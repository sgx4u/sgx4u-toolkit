# `isValidTimeZone`

Reports whether a value is a zone this runtime can use.

## Import

```ts
import { isValidTimeZone } from "@sgx4u/date-time";
```

## Signature

```ts
function isValidTimeZone(timeZone: unknown): boolean;
```

## Options

This function has no options.

## Examples

```ts
import { isValidTimeZone } from "@sgx4u/date-time";

isValidTimeZone("Asia/Kolkata");
// true

isValidTimeZone("+05:30");
// true

isValidTimeZone("Mars/Olympus");
// false

isValidTimeZone(330);
// false
```

## Edge cases

An IANA name is accepted when the runtime accepts it. A fixed offset `±HH:mm`, `±HHmm`, or `±HH` is accepted from its text, with hours 00 through 23 and minutes 00 through 59. Anything else, including a non-string, returns `false`. The function does not throw.

## Related

- [`getLocalTimeZone`](../get-local-time-zone/get-local-time-zone.md)
- [`listTimeZones`](../list-time-zones/list-time-zones.md)
- [`getUTCOffset`](../get-utc-offset/get-utc-offset.md)
