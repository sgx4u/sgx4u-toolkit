# `listBusinessDaysInInterval`

See the TSDoc on `listBusinessDaysInInterval` for the contract.

## Import

```ts
import { listBusinessDaysInInterval } from "@sgx4u/date-time";
```

## Examples

Thursday 26 November 2026 at 16:00 UTC plus 2 business hours is Friday at 10:00. The default window is 09:00–17:00 and the weekend is Saturday and Sunday.

## Edge cases

A calendar unit in `addBusinessHours` throws `RangeError`. A calendar with no business day throws after 3660 consecutive closed days. 17:00 is outside the default window.

## Related

- [`addBusinessDays`](../add-business-days/add-business-days.md)
