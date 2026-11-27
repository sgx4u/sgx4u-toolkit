# `randomNumber`

Returns a float in the range. `includeUpper` defaults to `false`. Not cryptographically secure.

## Import

```ts
import { randomNumber } from "@sgx4u/number";
```

## Signature

```ts
function randomNumber(parameters: {
    lower: number;
    upper: number;
    includeUpper?: boolean;
    random?: () => number;
}): number;
```

## Examples

```ts
randomNumber({ lower: 0, upper: 1, random: () => 0.5 });
```

## Edge cases

- Not cryptographically secure.
- The default range excludes `upper`.

## Related

- `randomInteger`
- `randomNumberSecure`
