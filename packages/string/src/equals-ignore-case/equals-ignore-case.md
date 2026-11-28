# `equalsIgnoreCase`

Reports whether two strings are equal ignoring case. Accents still matter, because the collator sensitivity is `accent`.

## Import

```ts
import { equalsIgnoreCase } from "@sgx4u/string";
```

## Signature

```ts
function equalsIgnoreCase(options: { first: string; second: string }): boolean;
```

## Options

| Option   | Default            | Description                                                                               |
| -------- | ------------------ | ----------------------------------------------------------------------------------------- |
| `first`  |                    | Left-hand string. A non-string returns `false`.                                           |
| `second` |                    | Right-hand string. A non-string returns `false`.                                          |
| `locale` | the runtime locale | Locale for a collator with sensitivity `"accent"`. Case is ignored. Accents still matter. |

## Examples

```ts
equalsIgnoreCase({ first: "A", second: "a" });
```

## Edge cases

`é` and `e` are not equal. Case is ignored and accents still matter, because the collator sensitivity is `"accent"`. `Café` equals `café`. `café` does not equal `cafe`. A non-string returns `false`.
