<a id="readme-top"></a>

<div align="center">
    <a href="https://github.com/sgx4u/sgx4u-toolkit">
        <img src="https://github.com/sgx4u/sgx4u-toolkit/blob/develop/logo.svg?raw=true" width="75" alt="SGX4U" />
    </a>

<h1 align="center">🌟 @sgx4u/boolean 🌟</h1>

<h3 align="center">Parses, formats, and combines boolean values.</h3>

<p align="center">
    <a href="../../.github/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/sgx4u/sgx4u-toolkit/ci.yml?branch=develop&style=for-the-badge&label=ci&labelColor=353535" alt="ci" /></a>
    <a href="../../LICENSE"><img src="https://img.shields.io/github/license/sgx4u/sgx4u-toolkit?style=for-the-badge&labelColor=353535&color=4f46e5" alt="License: MIT" /></a>
    <a href="./package.json"><img src="https://img.shields.io/badge/node-%3E%3D22.12-339933?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=353535" alt="Node &gt;=22.12" /></a>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

<p align="center">Part of <a href="../../README.md">@sgx4u/toolkit</a>.</p>
</div>

<br />

<h2 id="about">💫 About</h2>

`@sgx4u/boolean` recognizes boolean tokens, formats a boolean as a word, and combines boolean values and predicates. A value that is not a boolean stays unrecognized. The package does not coerce with `!!` and does not map an unknown string to `false`.

Experimental (`0.x`). Breaking changes may land in minor versions until 1.0.0.

The parameter list for every export is in [FUNCTIONS.md](./FUNCTIONS.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="installation">📥 Installation</h2>

```sh
pnpm add @sgx4u/boolean       # pnpm
npm install @sgx4u/boolean    # npm
yarn add @sgx4u/boolean       # yarn
```

Requires Node `>=22.12`. The package publishes ESM (`import`) and CommonJS (`require`). It has no runtime dependencies.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="usage">💡 Usage</h2>

```ts
import { createBoolean, formatBoolean, parseBoolean } from "@sgx4u/boolean";

parseBoolean(" YES "); // true
parseBoolean("maybe"); // undefined
parseBoolean({ value: "maybe", fallback: false }); // false

formatBoolean({ value: true, style: "yes-no", capitalization: "sentence" }); // "Yes"

const french = createBoolean({ locale: "fr", formatStyle: "yes-no" });
french.parseBoolean("oui"); // true
french.formatBoolean({ value: false }); // "non"
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="parsing">🔎 Parsing</h2>

`parseBoolean` accepts a primitive boolean, the numbers `0` and `1` (including `-0`, because `-0 === 0`), and these English tokens after trim and case-folding:

| Meaning | Tokens                                                     |
| ------- | ---------------------------------------------------------- |
| `true`  | `true`, `t`, `yes`, `y`, `on`, `1`, `enable`, `enabled`    |
| `false` | `false`, `f`, `no`, `n`, `off`, `0`, `disable`, `disabled` |

`null`, `""`, `"maybe"`, `"2"`, `"1.0"`, `"00"`, `"+1"`, `"0x1"`, `NaN`, objects, and arrays are not tokens. A boxed `Boolean` is an object, so it is not a boolean.

`wordListMode: "extend"` adds `truthyWords` and `falsyWords` to the English tokens and, when `locale` is set, that language's yes and no words. `"replace"` uses only the custom lists. Primitive booleans and `0` / `1` stay accepted in both modes.

`locale` is a BCP 47 tag. The language subtag is used (`hi-IN` selects `hi`). Locale words are yes and no, not translations of the identifiers `true` and `false`. An unknown language adds no words. Pass `wahr` / `falsch` through `truthyWords` / `falsyWords` when you need them.

`lenient: true` accepts English `yes` or `no` with one character replaced by a neighboring key. It does not typo-match other words. `"yss"` is `true`. `"mo"` is `false`. `"yess"`, `"yep"`, and `"tue"` are unrecognized.

`xor` is parity: true when an odd number of entries are `true`. For two values that is "different". For three or more it is not "exactly one". `exactlyOne` is that question.

`xnor` is even parity. For two values that is also equivalence. For three or more it is not "all equal": `xnor` of three `true` values is `false`. `areEqual` is that question.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="functions">📘 Functions</h2>

### Checks and parsing

- [`isBoolean`](./src/is-boolean/is-boolean.md) reports whether a value is a primitive boolean.
- [`isTruthy`](./src/is-truthy/is-truthy.md) reports whether a value is truthy.
- [`isFalsy`](./src/is-falsy/is-falsy.md) reports whether a value is falsy.
- [`isParseableBoolean`](./src/is-parseable-boolean/is-parseable-boolean.md) reports whether a value is a recognized boolean token.
- [`parseBoolean`](./src/parse-boolean/parse-boolean.md) turns a recognized token into `true` or `false`.
- [`getBooleanWords`](./src/get-boolean-words/get-boolean-words.md) returns the built-in yes and no vocabulary.
- [`listBooleanLocales`](./src/list-boolean-locales/list-boolean-locales.md) lists the language subtags in that vocabulary.

### Formatting

- [`formatBoolean`](./src/format-boolean/format-boolean.md) turns a boolean into a word.

### Logic

- [`not`](./src/not/not.md) negates a boolean. [`toggle`](./src/toggle/toggle.md) returns the same result.
- [`all`](./src/all/all.md), [`any`](./src/any/any.md), [`none`](./src/none/none.md), [`nand`](./src/nand/nand.md), and [`nor`](./src/nor/nor.md) combine a list.
- [`xor`](./src/xor/xor.md) is odd parity. [`exactlyOne`](./src/exactly-one/exactly-one.md) requires one `true`.
- [`xnor`](./src/xnor/xnor.md) is even parity. [`areEqual`](./src/are-equal/are-equal.md) requires every entry to match.
- [`implies`](./src/implies/implies.md) is material implication.
- [`countTrue`](./src/count-true/count-true.md) counts `true` entries.
- [`isMajorityTrue`](./src/is-majority-true/is-majority-true.md) reports whether `true` strictly outnumbers `false`.

### Predicates

- [`allPass`](./src/all-pass/all-pass.md), [`anyPass`](./src/any-pass/any-pass.md), [`nonePass`](./src/none-pass/none-pass.md), and [`exactlyOnePass`](./src/exactly-one-pass/exactly-one-pass.md) combine predicates.
- [`negate`](./src/negate/negate.md) inverts one predicate.
- [`impliesPass`](./src/implies-pass/implies-pass.md) is implication for two predicates.

### Factory

- [`createBoolean`](./src/create-boolean/create-boolean.md) binds defaults for the functions above. See [Configuration](#configuration).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="errors">🚧 Errors</h2>

An invalid value returns `undefined`. `isBoolean`, `isTruthy`, `isFalsy`, and `isParseableBoolean` return `false` instead. `isParseableBoolean` can still throw when an option is invalid.

These functions throw. The message names the argument and the value received.

| Function                                                                                                    | Error        | Why                                                                                                                                             |
| ----------------------------------------------------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `parseBoolean`, `isParseableBoolean`                                                                        | `TypeError`  | An option has the wrong type.                                                                                                                   |
| `parseBoolean`, `isParseableBoolean`                                                                        | `RangeError` | `truthyWords` and `falsyWords` share a word after trim and case-folding, including a clash with the English or locale lists in `"extend"` mode. |
| `getBooleanWords`                                                                                           | `TypeError`  | The argument is not an object, `locale` is not a string, or `category` is not `"truthy"`, `"falsy"`, or `"all"`.                                |
| `formatBoolean`                                                                                             | `TypeError`  | The argument is not an object, `style` or `capitalization` is not a known value, or `locale` is not a string.                                   |
| `all`, `any`, `none`, `nand`, `nor`, `xor`, `xnor`, `exactlyOne`, `areEqual`, `countTrue`, `isMajorityTrue` | `TypeError`  | `values` is not an array.                                                                                                                       |
| `implies`                                                                                                   | `TypeError`  | The argument is not a non-null object.                                                                                                          |
| `allPass`, `anyPass`, `nonePass`, `exactlyOnePass`                                                          | `TypeError`  | `predicates` is not an array, or an entry is not a function.                                                                                    |
| `negate`                                                                                                    | `TypeError`  | `predicate` is not a function.                                                                                                                  |
| `impliesPass`                                                                                               | `TypeError`  | The argument is not a non-null object, or either property is not a function.                                                                    |
| `createBoolean`                                                                                             | `TypeError`  | `config` is not an object, or an option has the wrong type. Thrown at creation.                                                                 |
| `createBoolean`                                                                                             | `RangeError` | The configured word lists overlap. Thrown at creation.                                                                                          |

`isBoolean`, `isTruthy`, `isFalsy`, `listBooleanLocales`, `not`, and `toggle` do not throw. A predicate that throws does so on its own. The combinator does not catch it.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="configuration">⚙️ Configuration</h2>

`createBoolean(config)` returns a `BooleanInstance`. Configurable methods use `config` unless a call sets the same field. Other methods are the package functions. Instances do not share mutable state, and creating one does not change `parseBoolean` imported from the package root.

| Option                 | Default                             |
| ---------------------- | ----------------------------------- |
| `locale`               | `"en"`                              |
| `truthyWords`          | `[]`                                |
| `falsyWords`           | `[]`                                |
| `wordListMode`         | `"extend"`                          |
| `caseSensitive`        | `false`                             |
| `trim`                 | `true`                              |
| `lenient`              | `false`                             |
| `fallback`             | omitted. A miss returns `undefined` |
| `formatStyle`          | `"true-false"`                      |
| `formatCapitalization` | `"lower"`                           |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="runtime-support">🌐 Runtime support</h2>

Runtime: `universal`. The same source runs in browsers, workers, and Node. It uses `String` case conversion and has no runtime dependencies.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="contributing">🤝 Contributing</h2>

Repository rules are in [CONTRIBUTING.md](../../CONTRIBUTING.md).

Owner: `@sgx4u`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="license">📄 License</h2>

[MIT](../../LICENSE) © 2026 Subhajit Ghosh

<p align="right">(<a href="#readme-top">back to top</a>)</p>
