# `parsePercent`

Parses a percentage into a ratio. `"25%"`, `"25 %"`, `"25"`, and `25` are all `0.25`. This is the form-input direction. {@link formatPercent} takes a ratio instead.

## Import

```ts
import { parsePercent } from "@sgx4u/number";
```

## Signature

```ts
function parsePercent(parameters: {
    value: string | number;
    locale?: string | readonly string[];
}): number | undefined;
```

## Examples

```ts
parsePercent({ value: "25%" });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `formatPercent`
- `parseLocaleNumber`
