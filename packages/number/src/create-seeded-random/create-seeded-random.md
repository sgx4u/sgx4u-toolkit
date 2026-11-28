# `createSeededRandom`

Returns a deterministic generator for a numeric or string seed. The same seed produces the same sequence. Not for secrets.

## Import

```ts
import { createSeededRandom } from "@sgx4u/number";
```

## Signature

```ts
function createSeededRandom(parameters: { seed: number | string }): {
    random: () => number;
    randomInteger: (parameters: {
        lower: number;
        upper: number;
        includeUpper?: boolean;
    }) => number;
    randomNumber: (parameters: {
        lower: number;
        upper: number;
        includeUpper?: boolean;
    }) => number;
};
```

## Examples

```ts
const seeded = createSeededRandom({ seed: 1 });
```

## Edge cases

- Not cryptographically secure.

## Related

- `randomInteger`
- `randomNumber`
