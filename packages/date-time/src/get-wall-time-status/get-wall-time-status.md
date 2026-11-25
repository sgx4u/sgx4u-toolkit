# `getWallTimeStatus`

See the TSDoc on `getWallTimeStatus` for the contract.

## Import

```ts
import { getWallTimeStatus } from "@sgx4u/date-time";
```

## Examples

On 10 March 2024, 02:30 in America/New_York is skipped. The spring-forward transition is 2024-03-10T07:00:00.000Z, from -300 minutes to -240.

## Edge cases

`getTimeZoneTransitions` throws when the interval is longer than 50 years. The next and previous searches stop after two years and return `undefined`.

## Related

- [`getUtcOffset`](../get-utc-offset/get-utc-offset.md)
