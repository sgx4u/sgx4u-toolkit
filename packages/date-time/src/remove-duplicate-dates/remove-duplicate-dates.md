# `removeDuplicateDates`

Returns the first date of each unit, in input order.

## Import

```ts
import { removeDuplicateDates } from "@sgx4u/date-time";
```

## Signature

```ts
function removeDuplicateDates(
    dates: readonly DateInput[],
    options?: RemoveDuplicateDatesOptions,
): Date[];
```

## Options

| Name       | Type       | Default         | Meaning                                    |
| ---------- | ---------- | --------------- | ------------------------------------------ |
| `timeZone` | `string`   | System zone     | Zone the unit is measured in.              |
| `unit`     | `TimeUnit` | `"millisecond"` | Dates that share this unit are duplicates. |

## Examples

```ts
removeDuplicateDates(
    ["2024-06-15T01:00:00Z", "2024-06-15T20:00:00Z", "2024-06-16T00:00:00Z"],
    { unit: "day", timeZone: "UTC" },
).map((date) => date.toISOString());
// ["2024-06-15T01:00:00.000Z", "2024-06-16T00:00:00.000Z"]

removeDuplicateDates(["2024-01-01T00:00:00Z", "2024-01-01T00:00:00Z"]).length;
// 1

removeDuplicateDates(["2024-03-10T06:30:00Z", "2024-03-10T07:30:00Z"], {
    unit: "day",
    timeZone: "America/New_York",
}).map((date) => date.toISOString());
// ["2024-03-10T06:30:00.000Z"]
```

## Edge cases

Later dates that fall in a unit already seen are dropped. The input array stays unchanged, and each result is a new `Date`. A value that is not an array throws `TypeError`. An invalid entry, unit, or zone throws `RangeError`. Weeks start on Monday.

The unit is a wall-clock unit in `timeZone`. A daylight-saving day is still one calendar day. On 2024-03-10 in `America/New_York`, 1:30 and 3:30 local (`06:30Z` and `07:30Z`) share a day because 2:00 does not exist, so the second instant is dropped. A skipped unit boundary moves forward to the first instant that exists.

## Related

- [`sortDates`](../sort-dates/sort-dates.md) returns dates in time order.
- [`isSameUnit`](../is-same-unit/is-same-unit.md) reports whether two dates share a unit.
- [`startOfUnit`](../start-of-unit/start-of-unit.md) returns the start of the unit used as the key.
