# `isValidTimeZone`

Reports whether a value is an IANA time zone or a fixed offset this runtime accepts.

## Import

```ts
import { isValidTimeZone } from "@sgx4u/date-time";
```

## Signature

```ts
function isValidTimeZone(timeZone: unknown): boolean;
```

## Examples

```ts
isValidTimeZone("Asia/Kolkata"); // true
isValidTimeZone("+05:30"); // true
isValidTimeZone("+0530"); // true
isValidTimeZone("Mars/Base"); // false
```

## Edge cases

A non-string returns `false` and does not throw. Hours must be `00`–`23` and minutes `00`–`59`. The function does not throw.

## Related

- [`getLocalTimeZone`](../get-local-time-zone/get-local-time-zone.md) reads the system zone.
- [`getUtcOffset`](../get-utc-offset/get-utc-offset.md) measures one instant.
