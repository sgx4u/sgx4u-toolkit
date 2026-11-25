# `getNextOpeningTime`

See the TSDoc on `getNextOpeningTime` for the contract.

## Import

```ts
import { getNextOpeningTime } from "@sgx4u/date-time";
```

## Examples

Thursday 26 November 2026 is open from 09:00 to 17:00 UTC when weekday 4 has that range. A 22:00–02:00 range is still open at 01:00 the next day.

## Edge cases

A closure removes the calendar day and the overnight range that starts on it. The search stops after 400 days.

## Related

- [`isWithinBusinessHours`](../is-within-business-hours/is-within-business-hours.md)
