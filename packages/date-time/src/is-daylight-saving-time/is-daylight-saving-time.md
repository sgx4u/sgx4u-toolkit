# `isDaylightSavingTime`

See the TSDoc on `isDaylightSavingTime` for the contract.

## Import

```ts
import { isDaylightSavingTime } from "@sgx4u/date-time";
```

## Examples

03:30 in Asia/Kolkata kept as a wall time in UTC is 03:30Z. Kolkata is 330 minutes ahead of UTC. 23:30 plus 2 hours is 01:30 on the next day.

## Edge cases

`addToTimeOfDay` rejects months and years. Daylight saving is the offset above the smaller of 1 January and 1 July.

## Related

- [`getUtcOffset`](../get-utc-offset/get-utc-offset.md)
