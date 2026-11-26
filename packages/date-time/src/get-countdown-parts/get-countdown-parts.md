# `getCountdownParts`

Splits the time remaining until a target into countdown fields.

## Import

```ts
import { getCountdownParts } from "@sgx4u/date-time";
```

## Signature

```ts
function getCountdownParts(
    params: GetCountdownPartsParams,
): CountdownParts | undefined;
```

## Options

| Name          | Type                                      | Required | Default                         | Meaning                                                    |
| ------------- | ----------------------------------------- | -------- | ------------------------------- | ---------------------------------------------------------- |
| `target`      | `DateInput`                               | Yes      | —                               | The instant being counted down to.                         |
| `now`         | `DateInput`                               | No       | `Date.now()`, read on each call | The instant to use instead of the current time.            |
| `largestUnit` | `"day" \| "hour" \| "minute" \| "second"` | No       | `"day"`                         | Largest unit to balance. Days are exact 24-hour stretches. |

## Examples

```ts
import { getCountdownParts } from "@sgx4u/date-time";

getCountdownParts("2026-01-01T01:00:00Z", {
    now: "2026-01-01T00:00:00Z",
    largestUnit: "hour",
}).hours;
// 1

getCountdownParts("2026-01-02T00:00:00Z", {
    now: "2026-01-01T00:00:00Z",
}).days;
// 1

getCountdownParts("2026-01-01T00:00:00Z", {
    now: "2026-01-01T01:00:00Z",
}).isComplete;
// true

getCountdownParts("2026-01-01T00:00:01.500Z", {
    now: "2026-01-01T00:00:00Z",
    largestUnit: "second",
}).milliseconds;
// 500
```

## Edge cases

Invalid `target` or `now` returns `undefined`. An unknown `largestUnit` throws.


## Related

- [`getRelativeTimeParts`](../get-relative-time-parts/get-relative-time-parts.md)
- [`getMillisecondsUntilNextUnit`](../get-milliseconds-until-next-unit/get-milliseconds-until-next-unit.md)
- [`millisecondsToDuration`](../milliseconds-to-duration/milliseconds-to-duration.md)
