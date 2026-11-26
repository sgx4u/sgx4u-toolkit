# `listTimeZones`

Returns the IANA time zones this runtime knows.

## Import

```ts
import { listTimeZones } from "@sgx4u/date-time";
```

## Signature

```ts
function listTimeZones(): string[];
```

## Options

This function has no options.

## Examples

```ts
import { listTimeZones } from "@sgx4u/date-time";

listTimeZones().includes("Africa/Abidjan");
// true

listTimeZones().includes("America/New_York");
// true

listTimeZones().length > 0;
// true
```

## Edge cases

The list is whatever the runtime reports. An older runtime without that data returns an empty list. Fixed offsets such as `+05:30` are accepted by `isValidTimeZone` and are not IANA names in this list.

## Related

- [`isValidTimeZone`](../is-valid-time-zone/is-valid-time-zone.md)
- [`getLocalTimeZone`](../get-local-time-zone/get-local-time-zone.md)
- [`getUTCOffset`](../get-utc-offset/get-utc-offset.md)
