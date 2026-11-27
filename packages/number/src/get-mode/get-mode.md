# `getMode`

Returns the unique most frequent finite value. An empty list or a tie returns `undefined`.

## Import

```ts
import { getMode } from "@sgx4u/number";
```

## Signature

```ts
function getMode(values: readonly number[]): number | undefined;
```

## Examples

```ts
getMode([1, 2, 2, 3]);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getModes`
