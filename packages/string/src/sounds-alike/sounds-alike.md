# `soundsAlike`

Reports whether two words share a phonetic code. Double Metaphone matches when any of the two codes overlap.

## Import

```ts
import { soundsAlike } from "@sgx4u/string";
```

## Signature

```ts
function soundsAlike(options: {
    first: string;
    second: string;
    algorithm?: "soundex" | "metaphone" | "double-metaphone";
}): boolean;
```

## Examples

```ts
soundsAlike({ first: "Smith", second: "Schmidt" });
```

## Edge cases

A non-string returns `false`.
