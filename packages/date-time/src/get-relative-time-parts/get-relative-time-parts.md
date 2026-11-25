# `getRelativeTimeParts`

See the TSDoc on `getRelativeTimeParts` for the contract.

## Import

```ts
import { getRelativeTimeParts } from "@sgx4u/date-time";
```

## Examples

Automatic unit selection uses seconds, minutes, hours, days, months, and years. Weeks are not chosen automatically. A negative value is the past.

## Edge cases

`now` defaults to the current time and is read on each call. Pass `now` in tests. The text comes from `Intl`.

## Related

- [`formatDate`](../format-date/format-date.md)
