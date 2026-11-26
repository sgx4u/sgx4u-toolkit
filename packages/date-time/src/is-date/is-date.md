# `isDate`

Reports whether a value is a `Date` object.

## Import

```ts
import { isDate } from "@sgx4u/date-time";
```

## Signature

```ts
function isDate(value: unknown): value is Date;
```

## Parameters

| Name    | Type      | Required | Default | Meaning    |
| ------- | --------- | -------- | ------- | ---------- |
| `value` | `unknown` | yes      |         | Any value. |

## Examples

```ts
import { isDate } from "@sgx4u/date-time";

isDate(new Date(0));
// true

isDate(new Date(NaN));
// true

isDate("2024-01-01T00:00:00Z");
// false

isDate(0);
// false
```

## Edge cases

A `Date` from another realm counts. An Invalid Date counts too. Use `isValidDate` when the instant has to be real. The function does not throw.

## Related

- [`isValidDate`](../is-valid-date/is-valid-date.md)
- [`isSameInstant`](../is-same-instant/is-same-instant.md)
- [`getDateParts`](../get-date-parts/get-date-parts.md)
