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

## Parameters

| Name          | Type                                      | Required | Default                          | Meaning                                         |
| ------------- | ----------------------------------------- | -------- | -------------------------------- | ----------------------------------------------- |
| `target`      | `DateInput`                               | yes      |                                  | The instant being counted down to.              |
| `largestUnit` | `"day" \| "hour" \| "minute" \| "second"` | no       | `"day"`                          | Days are 24-hour stretches of elapsed time.     |
| `now`         | `DateInput`                               | no       | `Date.now()`, read on each call. | The instant to use instead of the current time. |

## Examples

```ts
import { getCountdownParts } from "@sgx4u/date-time";

getCountdownParts({
    target: "2026-01-01T01:00:00Z",
    now: "2026-01-01T00:00:00Z",
    largestUnit: "hour",
}).hours;
// 1

getCountdownParts({
    target: "2026-01-02T00:00:00Z",
    now: "2026-01-01T00:00:00Z",
}).days;
// 1

getCountdownParts({
    target: "2026-01-01T00:00:00Z",
    now: "2026-01-01T01:00:00Z",
}).isComplete;
// true

getCountdownParts({
    target: "2026-01-01T00:00:01.500Z",
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
