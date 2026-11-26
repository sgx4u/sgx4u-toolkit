# `isSameInstant`

Reports whether two values are the same millisecond.

## Import

```ts
import { isSameInstant } from "@sgx4u/date-time";
```

## Signature

```ts
function isSameInstant(params: IsSameInstantParams): boolean;
```

## Parameters

| Name     | Type        | Required | Default | Meaning          |
| -------- | ----------- | -------- | ------- | ---------------- |
| `first`  | `DateInput` | yes      |         | The first date.  |
| `second` | `DateInput` | yes      |         | The second date. |

## Examples

```ts
import { isSameInstant } from "@sgx4u/date-time";

isSameInstant({ first: "1970-01-01T00:00:00.000Z", second: 0 });
// true

isSameInstant({
    first: "2024-01-01T00:00:00Z",
    second: "2024-01-01T00:00:00.000Z",
});
// true

isSameInstant({ first: "2024-01-01T00:00:00Z", second: 0 });
// false
```

## Edge cases

A number is Unix time in milliseconds. Text with a `Z` or numeric offset is an instant. A value that is not a real date returns `undefined`.

## Related

- [`isAfter`](../is-after/is-after.md)
- [`isBefore`](../is-before/is-before.md)
- [`isValidDate`](../is-valid-date/is-valid-date.md)
