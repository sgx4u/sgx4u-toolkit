# `randomNumberSecure`

Returns a float in the range using `crypto.getRandomValues`. `includeUpper` defaults to `false`.

## Import

```ts
import { randomNumberSecure } from "@sgx4u/number";
```

## Signature

```ts
function randomNumberSecure(parameters: {
    lower: number;
    upper: number;
    includeUpper?: boolean;
}): number;
```

## Examples

```ts
randomNumberSecure({ lower: 0, upper: 1 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `randomNumber`
- `randomIntegerSecure`
