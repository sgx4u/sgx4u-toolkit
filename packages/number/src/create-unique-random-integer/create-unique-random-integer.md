# `createUniqueRandomInteger`

Returns a function that yields each integer in the range once, then starts again. Not cryptographically secure.

## Import

```ts
import { createUniqueRandomInteger } from "@sgx4u/number";
```

## Signature

```ts
function createUniqueRandomInteger(parameters: {
    lower: number;
    upper: number;
    includeUpper?: boolean;
    random?: () => number;
}): () => number;
```

## Examples

```ts
const next = createUniqueRandomInteger({ lower: 1, upper: 2, random: () => 0 });
```

## Edge cases

- Not cryptographically secure.
- A span above 1000000 throws `RangeError`.

## Related

- `randomInteger`
