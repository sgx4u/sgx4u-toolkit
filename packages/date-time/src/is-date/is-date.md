# `isDate`

Reports whether a value is a `Date` object, including an Invalid Date and a `Date` created in another realm.

## Import

```ts
import { isDate } from "@sgx4u/date-time";
```

## Signature

```ts
function isDate(value: unknown): value is Date;
```

## Examples

```ts
isDate(new Date(0)); // true
isDate(new Date(Number.NaN)); // true
isDate("2024-02-29"); // false
```

## Edge cases

An object with a `getTime` method is not a `Date` unless `Object.prototype.toString` reports `[object Date]`. The function does not throw.

## Related

- [`isValidDate`](../is-valid-date/is-valid-date.md) also requires a finite time value.
