# `parseTimeOfDay`

Parses `09:30`, `21:30:15.250`, and `9:30 pm`.

## Import

```ts
import { parseTimeOfDay } from "@sgx4u/date-time";
```

## Signature

```ts
function parseTimeOfDay(value: string): TimeOfDay | undefined;
```

## Examples

```ts
parseTimeOfDay("9:30 pm");
// { hour: 21, minute: 30, second: 0, millisecond: 0 }

parseTimeOfDay("24:00"); // undefined
```

## Edge cases

`am` and `pm` may use any case, an optional space, and optional dots. `12:00 am` is midnight. A non-string throws `TypeError`.

## Related

- [`getDateParts`](../get-date-parts/get-date-parts.md) reads the time from an instant.
