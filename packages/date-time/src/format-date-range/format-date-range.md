# `formatDateRange`

See the TSDoc on `formatDateRange` for the contract.

## Import

```ts
import { formatDateRange } from "@sgx4u/date-time";
```

## Examples

`getLocaleDatePattern` maps the locale's numeric date to `dd`, `MM`, and `yyyy`. `formatDateRange` throws when the start is after the end.

## Edge cases

The pattern uses a fixed UTC reference date, so it does not depend on the system zone.

## Related

- [`formatDateWithStyle`](../format-date-with-style/format-date-with-style.md)
