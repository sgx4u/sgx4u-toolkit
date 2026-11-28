# `mean`

Returns the arithmetic mean. An empty list returns `undefined`.

## Import

```ts
import { mean } from "@sgx4u/number";
```

## Signature

```ts
function mean(values: readonly number[]): number | undefined;
```

## Examples

```ts
mean([1, 2, 3]);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `median`
- `sum`
