# `compareNatural`

Compares two strings with numeric collation, so `a2` sorts before `a10`.

## Import

```ts
import { compareNatural } from "@sgx4u/string";
```

## Signature

```ts
function compareNatural(options: {
    first: string;
    second: string;
}): -1 | 0 | 1 | undefined;
```

## Options

| Option        | Default            | Description                                            |
| ------------- | ------------------ | ------------------------------------------------------ |
| `first`       |                    | Left-hand string. A non-string returns `undefined`.    |
| `second`      |                    | Right-hand string. A non-string returns `undefined`.   |
| `locale`      | the runtime locale | Locale passed to a numeric collator.                   |
| `sensitivity` | `"variant"`        | Collator sensitivity. Numeric comparison is always on. |

## Examples

```ts
compareNatural({ first: "a2", second: "a10" });
```

## Edge cases

A non-string returns `undefined`.
