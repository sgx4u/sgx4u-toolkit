# `fromFraction`

Divides a numerator by a denominator. A denominator of zero returns `undefined`.

## Import

```ts
import { fromFraction } from "@sgx4u/number";
```

## Signature

```ts
function fromFraction(parameters: {
    numerator: number;
    denominator: number;
}): number | undefined;
```

## Examples

```ts
fromFraction({ numerator: 1, denominator: 4 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `toFraction`
