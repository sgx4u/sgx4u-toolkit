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

## Parameters

| Name | Type | Required | Default | Meaning |
| ---- | ---- | -------- | ------- | ------- |

## Examples

```ts
import { getLocalTimeZone, isValidTimeZone } from "@sgx4u/date-time";

getLocalTimeZone();
// "UTC"

isValidTimeZone(getLocalTimeZone());
// true
```

## Edge cases

None.

## Related

- [`isValidTimeZone`](../is-valid-time-zone/is-valid-time-zone.md)
- [`listTimeZones`](../list-time-zones/list-time-zones.md)
- [`getUTCOffset`](../get-utc-offset/get-utc-offset.md)
