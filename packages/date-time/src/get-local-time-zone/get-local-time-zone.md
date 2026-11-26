# `getLocalTimeZone`

Returns the system's IANA time zone.

## Import

```ts
import { getLocalTimeZone } from "@sgx4u/date-time";
```

## Signature

```ts
function getLocalTimeZone(): string;
```

## Options

This function has no options.

## Examples

```ts
import { getLocalTimeZone, isValidTimeZone } from "@sgx4u/date-time";

getLocalTimeZone();
// "UTC"

isValidTimeZone(getLocalTimeZone());
// true
```

## Edge cases

The name is read on each call and is not cached, so a process that changes its zone sees the new name on the next call. The first example is the zone of the runtime that produced this page; a process whose zone is not UTC returns that other name.

## Related

- [`isValidTimeZone`](../is-valid-time-zone/is-valid-time-zone.md)
- [`listTimeZones`](../list-time-zones/list-time-zones.md)
- [`getUtcOffset`](../get-utc-offset/get-utc-offset.md)
