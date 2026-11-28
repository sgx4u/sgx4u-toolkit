# `randomInteger`

Returns an integer in the range. `includeUpper` defaults to `true`. Not cryptographically secure. Pass `random` to supply a float in `[0, 1)`.

## Import

```ts
import { randomInteger } from "@sgx4u/number";
```

## Signature

```ts
function randomInteger(parameters: {
    lower: number;
    upper: number;
    includeUpper?: boolean;
    random?: () => number;
}): number;
```

## Examples

```ts
randomInteger({ lower: 1, upper: 6, random: () => 0 });
```

## Edge cases

- Not cryptographically secure.
- The default includes `upper`, which matches a die.

## Related

- `randomIntegerSecure`
- `randomNumber`
