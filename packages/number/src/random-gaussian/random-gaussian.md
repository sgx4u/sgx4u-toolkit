# `randomGaussian`

Returns a normal sample using the Box-Muller transform. Not cryptographically secure. A non-positive finite `standardDeviation` returns `undefined`.

## Import

```ts
import { randomGaussian } from "@sgx4u/number";
```

## Signature

```ts
function randomGaussian(parameters: {
    mean?: number;
    standardDeviation?: number;
    random?: () => number;
}): number | undefined;
```

## Examples

```ts
randomGaussian({ mean: 0, standardDeviation: 1, random: () => 0.5 });
```

## Edge cases

- Not cryptographically secure.
- Each call reads two samples.

## Related

- `randomNumber`
