# `getBooleanWords`

Returns a new copy of the built-in vocabulary. English tokens come first. A known locale appends its yes/no words, skipping spellings that are already present. `en` returns the full English token lists, not only yes and no. An unknown language returns the English lists alone.

## Import

```ts
import { getBooleanWords } from "@sgx4u/boolean";
```

## Signature

```ts
function getBooleanWords(input?: GetBooleanWordsInput): BooleanWords;
```

## Options

| Option     | Type                           | Default |
| ---------- | ------------------------------ | ------- |
| `locale`   | `string`                       | `"en"`  |
| `category` | `"truthy" \| "falsy" \| "all"` | `"all"` |

`category: "truthy"` leaves `falsy` empty, and the reverse. Call it with no argument for both English sides.

## Examples

```ts
getBooleanWords({ locale: "fr" }).truthy.at(-1); // "oui"
getBooleanWords({ locale: "fr", category: "falsy" }).truthy; // []
```

## Edge cases

| Call                                             | Result                             |
| ------------------------------------------------ | ---------------------------------- |
| `getBooleanWords()`                              | English `true`/`false` token lists |
| `getBooleanWords({ locale: "xx" })`              | the same English lists             |
| `getBooleanWords("fr")`, `getBooleanWords(null)` | throws `TypeError`                 |
| `category: "both"`                               | throws `TypeError`                 |
