# `parseLocaleDate`

See the TSDoc on `parseLocaleDate` for the contract.

## Import

```ts
import { parseLocaleDate } from "@sgx4u/date-time";
```

## Examples

`parseLocaleDate("11/26/2026", { locale: "en-US", timeZone: "UTC" })` is midnight on 26 November 2026. A zone name such as `GMT+05:30` comes from `Intl`.

## Edge cases

Impossible days return `undefined`. Separators may be `/`, `.`, `-`, or a space.

## Related

- [`getLocaleDatePattern`](../get-locale-date-pattern/get-locale-date-pattern.md)
