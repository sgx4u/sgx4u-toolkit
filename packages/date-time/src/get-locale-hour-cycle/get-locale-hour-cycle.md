# `getLocaleHourCycle`

See the TSDoc on `getLocaleHourCycle` for the contract.

## Import

```ts
import { getLocaleHourCycle } from "@sgx4u/date-time";
```

## Examples

Names come from `Intl` for a fixed UTC reference date, so they do not depend on the system zone. `en-US` month names start with January and weekday names start on Monday unless `startsOn` says otherwise.

## Edge cases

`formatDateWithStyle` uses `dateStyle: "medium"` when neither style is set.

## Related

- [`formatDate`](../format-date/format-date.md)
