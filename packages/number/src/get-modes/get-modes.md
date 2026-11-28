# `getModes`

Returns every finite value with the highest frequency, sorted ascending. An empty list or a non-finite value returns an empty list.

## Import

```ts
import { getModes } from "@sgx4u/number";
```

## Signature

```ts
function getModes(values: readonly number[]): number[];
```

## Examples

```ts
getModes([1, 1, 2, 2, 3]);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getMode`
