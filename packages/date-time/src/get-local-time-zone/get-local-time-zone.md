# `getLocalTimeZone`

Returns the system's IANA time zone, read on each call.

## Import

```ts
import { getLocalTimeZone } from "@sgx4u/date-time";
```

## Signature

```ts
function getLocalTimeZone(): string;
```

## Examples

```ts
getLocalTimeZone(); // "Asia/Kolkata" when that is the system zone
```

## Edge cases

The name is not cached. A later call sees a zone change made by the runtime.

## Related

- [`isValidTimeZone`](../is-valid-time-zone/is-valid-time-zone.md) checks a zone name.
