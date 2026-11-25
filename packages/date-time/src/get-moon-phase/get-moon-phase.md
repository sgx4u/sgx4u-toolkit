# `getMoonPhase`

Returns the moon's synodic phase and one of eight names.

## Import

```ts
import { getMoonPhase } from "@sgx4u/date-time/astronomy";
```

## Signature

```ts
function getMoonPhase(date: DateInput): {
    fraction: number;
    name: MoonPhaseName;
};
```

## Examples

```ts
getMoonPhase("2000-01-06T18:14:00.000Z").name; // "new-moon"
```

## Edge cases

`fraction` is in `[0, 1)`. The names are equal parts of the cycle, centred on new moon, first quarter, full moon, and last quarter. The reference new moon is 2000-01-06 18:14 UTC.

## Related

- [`getSeason`](../get-season/get-season.md) is on the root entry.
