# `randomIntegerSecure`

Returns a uniform integer using `crypto.getRandomValues`.

## Import

```ts
import { randomIntegerSecure } from "@sgx4u/number";
```

## Signature

```ts
function randomIntegerSecure(parameters: {
    lower: number;
    upper: number;
    includeUpper?: boolean;
}): number;
```

## Examples

```ts
randomIntegerSecure({ lower: 0, upper: 1 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `randomInteger`
- `randomNumberSecure`
