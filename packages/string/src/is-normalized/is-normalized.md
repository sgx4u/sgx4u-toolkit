# `isNormalized`

Reports whether a string is already in a Unicode normalization form. The default form is NFC. The check is `value === value.normalize(form)`.

## Import

```ts
import { isNormalized } from "@sgx4u/string";
```

## Signature

```ts
function isNormalized(value: string): boolean;
function isNormalized(options: {
    value: string;
    form?: "NFC" | "NFD" | "NFKC" | "NFKD";
}): boolean;
```

## Options

| Option  | Default | Meaning                                         |
| ------- | ------- | ----------------------------------------------- |
| `value` |         | The text to test. A non-string returns `false`. |
| `form`  | `"NFC"` | `NFC`, `NFD`, `NFKC`, or `NFKD`.                |

## Examples

```ts
isNormalized("é"); // true
isNormalized("e\u0301"); // false
isNormalized({ value: "e\u0301", form: "NFD" }); // true
```

## Edge cases

An empty string returns `true`. A non-string returns `false`. An unknown `form` throws `RangeError`. A `form` that is not a string throws `TypeError`. The input is not changed.
