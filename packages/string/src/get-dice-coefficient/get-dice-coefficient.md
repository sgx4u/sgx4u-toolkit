# `getDiceCoefficient`

The Sørensen–Dice coefficient from 0 to 1.

## Import

```ts
import { getDiceCoefficient } from "@sgx4u/string";
```

## Signature

```ts
function getDiceCoefficient(options: {
    first: string;
    second: string;
}): number | undefined;
```

## Examples

```ts
getDiceCoefficient({ first: "kitten", second: "sitting" });
```

## Edge cases

A non-string returns `undefined`.
