# `getTimeOfDay`

See the TSDoc on `getTimeOfDay` for the contract.

## Import

```ts
import { getTimeOfDay } from "@sgx4u/date-time";
```

## Examples

An overnight range such as 22:00–06:00 contains 23:00 and 05:00. The end is excluded unless `includeEnd` is true.

## Edge cases

`getTimeOfDay` reads the wall clock in `timeZone`. A date-only string is midnight in that zone.

## Related

- [`parseTimeOfDay`](../parse-time-of-day/parse-time-of-day.md)
