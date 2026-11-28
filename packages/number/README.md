<a id="readme-top"></a>

<div align="center">
    <a href="https://github.com/sgx4u/sgx4u-toolkit">
        <img src="https://github.com/sgx4u/sgx4u-toolkit/blob/develop/logo.svg?raw=true" width="75" alt="SGX4U" />
    </a>

<h1 align="center">🌟 @sgx4u/number 🌟</h1>

<h3 align="center">Checks, parses, rounds, formats, and compares numbers.</h3>

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

`@sgx4u/number` is a zero-dependency number library. It checks and parses values, rounds with the same mode names as `Intl.NumberFormat`, does decimal-scale arithmetic for everyday values, formats with `Intl`, and includes statistics, random helpers, bases, Roman numerals, and BigInt helpers.

Number-to-words lives on locale subpaths, so a caller who never spells a number does not download a word list.

The parameter and return reference is in [FUNCTIONS.md](./FUNCTIONS.md). Each function also has a guide next to its source.

Experimental (`0.x`). Breaking changes may land in minor versions until 1.0.0.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="installation">📥 Installation</h2>

```sh
pnpm add @sgx4u/number       # pnpm
npm install @sgx4u/number    # npm
yarn add @sgx4u/number       # yarn
```

Requires Node `>=22.12`. The package publishes ESM (`import`) and CommonJS (`require`).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="usage">💡 Usage</h2>

```ts
import { addPrecise, clamp, createNumber, formatNumber } from "@sgx4u/number";
import { toWords } from "@sgx4u/number/words/en-IN";

addPrecise({ first: 0.1, second: 0.2 }); // 0.3
clamp({ value: 12, lower: 0, upper: 10 }); // 10
formatNumber({ value: 1234567.89, locale: "en-IN" });

const numbers = createNumber({
    locale: "en-IN",
    currency: "INR",
    roundingMode: "halfEven",
});
numbers.formatCurrency({ value: 100000 });

toWords({ value: 100000 }); // "one lakh"
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="arguments">Arguments</h2>

A function that takes one value takes that value directly: `isFiniteNumber(value)`, `mean(values)`, `toDegrees(radians)`.

A function that takes several values takes one flat object. Options are fields on that same object. `clamp({ value, lower, upper })`. `formatCurrency({ value, currency, locale })`.

The same names are used throughout: `value`, `values`, `first` / `second`, `lower` / `upper`, `start` / `end`, `locale`, `currency`, `roundingMode`, `precision`, and `iteratee`.

Public math and formatting functions take `number` or, when the name says so, `bigint`. They do not coerce strings. Parse first with `parseNumber` or `parseLocaleNumber`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="errors">Errors</h2>

Invalid input returns `undefined`. `is*` functions return `false` and do not throw. `parse*` returns `undefined` when the text is not a number.

These functions throw. The message names the argument and the value received.

| Function                                                                                                                  | Reason                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `parseLocaleNumber`, `parsePercent`, `parseCurrency`                                                                      | `locale` is not a structurally valid locale. `parseCurrency` also throws when `currency` is passed and `Intl` rejects it.               |
| `parseBytes`                                                                                                              | `standard` is not `"SI"`, `"IEC"`, or `"auto"`.                                                                                         |
| `clamp`, `clampBigInt`                                                                                                    | `lower` is greater than `upper`.                                                                                                        |
| `createRange`, `createInclusiveRange`, `createBigIntRange`                                                                | `step` is zero, has the wrong sign, is not finite, or the sequence would be longer than 1000000.                                        |
| `wrapNumber`                                                                                                              | `lower` is greater than or equal to `upper`.                                                                                            |
| `roundNumber`, `ceilNumber`, `floorNumber`, `truncateNumber`                                                              | `precision` is not an integer from -308 to 308. `roundNumber` also throws for an unknown `mode`.                                        |
| `roundToIncrement`, `toSignificantDigits`                                                                                 | `mode` is unknown. `toSignificantDigits` also throws when `digits` is not a positive integer.                                           |
| `randomInteger`, `randomNumber`, `randomIntegerSecure`, `randomNumberSecure`, `randomBigInt`, `createUniqueRandomInteger` | The range is empty or the bounds are not valid. `random` returned a number outside `[0, 1)`.                                            |
| `randomIntegerSecure`, `randomNumberSecure`                                                                               | `crypto.getRandomValues` is missing.                                                                                                    |
| `createSeededRandom`                                                                                                      | `seed` is not a finite number or a string.                                                                                              |
| `getPercentile`, `getQuantile`                                                                                            | The percentile is outside 0 to 100, the probability is outside 0 to 1, or `method` is unknown.                                          |
| `formatNumber` and the other formatters, `getNumberFormatParts`, `getLocaleNumberSymbols`, `getCurrencySymbol`            | `locale`, `numberingSystem`, `roundingMode`, `currency`, or `unit` is invalid. `formatCurrency` also throws when `currency` is missing. |
| `toBase`, `fromBase`                                                                                                      | `base` is outside 2 to 36, or `minimumDigits` is not a positive integer.                                                                |
| `toRomanNumeral`                                                                                                          | `style` is not `"standard"` or `"extended"`.                                                                                            |
| `toCurrencyWords`                                                                                                         | `currency` is not a three-letter code and is not in the locale table.                                                                   |
| `interpolateAngle`                                                                                                        | `unit` is not `"radians"` or `"degrees"`.                                                                                               |
| `createNumber`                                                                                                            | A config field is invalid. `random` must be a function, which throws `TypeError`. Other invalid fields throw `RangeError`.              |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="precise-arithmetic">Precise arithmetic</h2>

`addPrecise`, `subtractPrecise`, `multiplyPrecise`, and `dividePrecise` scale the decimal text of each finite number to integers, compute, and scale back. `addPrecise({ first: 0.1, second: 0.2 })` is `0.3`.

These helpers are for everyday decimal values, such as money to a few places or UI math. They are not a decimal type. A very large magnitude or a very long fractional part can still be unrepresentable as a `number`. `dividePrecise` rounds a repeating result to 15 fractional digits, with ties away from zero. A divisor of `0` or `-0` returns `undefined`.

`sum` and `sumPrecise` are different. They return the correctly rounded sum of the exact IEEE values. `sumPrecise([0.1, 0.2])` is the same double as `0.1 + 0.2`, not the decimal `0.3`. An empty list is `0`. `Math.sumPrecise` of an empty list is `-0`. This package returns `0` for that case. When `Math.sumPrecise` exists, a non-empty list uses it.

`stripImpreciseRemainder` rewrites one just-computed artifact, such as `0.30000000000000004`, to the nearby short decimal. A value that is already the intended representation is left alone.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="rounding">Rounding modes</h2>

`roundNumber` uses the same names and meanings as `Intl.NumberFormat` `roundingMode`:

`"ceil"`, `"floor"`, `"expand"`, `"trunc"`, `"halfCeil"`, `"halfFloor"`, `"halfExpand"`, `"halfTrunc"`, `"halfEven"`.

The default is `"halfExpand"` (ties away from zero). `"halfEven"` is available for financial display and statistics.

`precision` is the number of digits after the decimal point. A negative precision rounds to tens, hundreds, and so on: `roundNumber({ value: 1234, precision: -2 })` is `1200`. The decision uses the exact value of the double. A decimal literal that is not exact can sit just below a halfway boundary.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="create-number">createNumber</h2>

`createNumber(config)` returns a frozen object with every root function. Per-call properties override the config. Standalone functions keep working with the built-in defaults. There is no global mutable locale or random generator. Two instances do not affect each other.

Word functions are not on the instance. Import a locale subpath for those. There is no `createWords` helper.

| Field                 | Type                                                          | Default                                                                                      |
| --------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `locale`              | `string \| readonly string[]`                                 | Runtime locale, read by `Intl` on each call                                                  |
| `currency`            | `string`                                                      | None. `formatCurrency` throws until a call or the config provides one                        |
| `currencyDisplay`     | `"symbol" \| "narrowSymbol" \| "code" \| "name"`              | `"symbol"`                                                                                   |
| `roundingMode`        | `RoundingMode`                                                | `"halfExpand"`                                                                               |
| `useGrouping`         | `boolean \| "always" \| "min2" \| "auto"`                     | `"auto"`                                                                                     |
| `numberingSystem`     | `string`                                                      | Runtime default                                                                              |
| `compactDisplay`      | `"short" \| "long"`                                           | `"short"`                                                                                    |
| `signDisplay`         | `"auto" \| "always" \| "exceptZero" \| "negative" \| "never"` | `"auto"`                                                                                     |
| `trailingZeroDisplay` | `"auto" \| "stripIfInteger"`                                  | `"auto"`                                                                                     |
| `byteStandard`        | `"SI" \| "IEC"`                                               | `"SI"`. `formatBytes` uses it. `parseBytes` stays `"auto"` unless the config sets this field |
| `random`              | `() => number`                                                | `Math.random`. The function must return a float in `[0, 1)`                                  |
| `absoluteTolerance`   | `number`                                                      | `0`                                                                                          |
| `relativeTolerance`   | `number`                                                      | `Number.EPSILON * 8`                                                                         |
| `percentileMethod`    | `QuantileMethod`                                              | `"linear"` (Hyndman-Fan type 7). The instance `getQuartiles` uses this method                |

When the config includes `currency`, `formatCurrency` and `getCurrencySymbol` no longer require `currency` on each call.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="randomness">Randomness</h2>

`randomInteger`, `randomNumber`, `randomGaussian`, `randomBigInt`, `createUniqueRandomInteger`, and `createSeededRandom` are not cryptographically secure. Pass `random` to inject a float in `[0, 1)`. `createNumber({ random })` binds that default for the instance.

`randomInteger` includes `upper` by default. `randomNumber` excludes `upper` by default.

`randomIntegerSecure` and `randomNumberSecure` use `crypto.getRandomValues`. They throw when that function is missing.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="subpaths">Subpaths</h2>

| Subpath                     | Contents                                                                                                                                                        |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@sgx4u/number`             | Checks, parsing, ranges, rounding, arithmetic, random helpers, statistics, formatting, bases, Roman numerals, BigInt helpers, interpolation, and `createNumber` |
| `@sgx4u/number/words/en`    | `toWords`, `toOrdinalWords`, `toCurrencyWords`, and `fromWords` on the short scale (thousand through decillion)                                                 |
| `@sgx4u/number/words/en-IN` | The same four functions on the Indian scale (thousand, lakh, crore, arab, kharab, nil, padma, shankh)                                                           |

Do not import a `@sgx4u/number/words` barrel. That entry does not exist, so a caller downloads only the locale they import.

`USD`, `EUR`, `GBP`, and `INR` have major and minor names. Any other three-letter code uses the code as the major name and `"minor"` for the hundredth. Cheque style is opt-in (`style: "cheque"`) and looks like `"Rupees One Lakh Only"`.

Ordinal text in the root formatter is first-class for English (`st`, `nd`, `rd`, `th`), French (`er`, `e`), and German (a trailing period). Other locales, including Japanese and Arabic, return the formatted integer.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="functions">📘 Functions</h2>

### Checks and parsing

- [`isNumber`](./src/is-number/is-number.md) Reports whether `value` is a number.
- [`isFiniteNumber`](./src/is-finite-number/is-finite-number.md) Reports whether `value` is a finite number.
- [`isInteger`](./src/is-integer/is-integer.md) Reports whether `value` is an integer number.
- [`isSafeInteger`](./src/is-safe-integer/is-safe-integer.md) Reports whether `value` is a safe integer.
- [`isNaNNumber`](./src/is-nan-number/is-nan-number.md) Reports whether `value` is the number `NaN`.
- [`isEven`](./src/is-even/is-even.md) Reports whether `value` is a finite even integer. Fractions and non-numbers return `false`.
- [`isOdd`](./src/is-odd/is-odd.md) Reports whether `value` is a finite odd integer. Fractions and non-numbers return `false`.
- [`isPositive`](./src/is-positive/is-positive.md) Reports whether `value` is a number greater than zero. Zero, `-0`, `NaN`, and non-numbers return `false`.
- [`isNegative`](./src/is-negative/is-negative.md) Reports whether `value` is a number less than zero. Zero, `-0`, and non-numbers return `false`.
- [`isNonNegative`](./src/is-non-negative/is-non-negative.md) Reports whether `value` is a number greater than or equal to zero. This includes `0` and `-0`.
- [`isNonPositive`](./src/is-non-positive/is-non-positive.md) Reports whether `value` is a number less than or equal to zero. This includes `0` and `-0`.
- [`isMultipleOf`](./src/is-multiple-of/is-multiple-of.md) Reports whether `value` is a finite integer multiple of `divisor`.
- [`isPrime`](./src/is-prime/is-prime.md) Reports whether `value` is a prime number.
- [`isPowerOfTwo`](./src/is-power-of-two/is-power-of-two.md) Reports whether `value` is an integer power of two and at least 1.
- [`isInRange`](./src/is-in-range/is-in-range.md) Reports whether `value` lies in the range. The range is half-open `[start, end)` unless `includeStart` or `includeEnd` says otherwise.
- [`parseNumber`](./src/parse-number/parse-number.md) Parses a finite number or a plain decimal string. Grouping separators, currency, and the words `NaN` and `Infinity` return `undefined`. See parseLocaleNumber for grouped text.
- [`parseInteger`](./src/parse-integer/parse-integer.md) Parses a finite integer with parseNumber. Fractions and other invalid input return `undefined`.
- [`parseFiniteNumber`](./src/parse-finite-number/parse-finite-number.md) Parses a finite number from a number or a plain decimal string. This is the same acceptance rule as parseNumber.
- [`parseLocaleNumber`](./src/parse-locale-number/parse-locale-number.md) Parses a locale-formatted number, including grouping separators such as Indian `12,34,567.89` and German `1.234,56`.
- [`parsePercent`](./src/parse-percent/parse-percent.md) Parses a percentage into a ratio. `"25%"`, `"25 %"`, `"25"`, and `25` are all `0.25`. This is the form-input direction. formatPercent takes a ratio instead.
- [`parseCurrency`](./src/parse-currency/parse-currency.md) Strips a locale currency symbol or code, then parses the remaining locale number.
- [`parseBytes`](./src/parse-bytes/parse-bytes.md) Parses a byte or bit size into a count of bytes. `"1.34 kB"` is `1340` and `"1 KiB"` is `1024`. Bit units are divided by 8.

### Clamp, compare, ranges, and mapping

- [`clamp`](./src/clamp/clamp.md) Clamps `value` to the inclusive interval `[lower, upper]`. `-0` is preserved when it is the bound that is hit or the value already inside the interval.
- [`compareNumbers`](./src/compare-numbers/compare-numbers.md) Compares two numbers. Returns `-1`, `0`, or `1`. `NaN` and non-numbers return `undefined`. `-0` and `0` compare equal.
- [`getMinimum`](./src/get-minimum/get-minimum.md) Returns the smallest finite number in `values`. Any non-finite value, or an empty list, returns `undefined`.
- [`getMaximum`](./src/get-maximum/get-maximum.md) Returns the largest finite number in `values`. Any non-finite value, or an empty list, returns `undefined`.
- [`getExtent`](./src/get-extent/get-extent.md) Returns the minimum and maximum of `values`. Any non-finite value, or an empty list, returns `undefined`.
- [`createRange`](./src/create-range/create-range.md) Creates the half-open sequence `[start, end)`. `start` defaults to 0 and `step` defaults to 1. Decimal steps use decimal arithmetic, so a step of `0.1` does not drift.
- [`createInclusiveRange`](./src/create-inclusive-range/create-inclusive-range.md) Creates the closed sequence `[start, end]`. `end` is included when it lands on a step.
- [`wrapNumber`](./src/wrap-number/wrap-number.md) Maps `value` into the half-open interval `[lower, upper)`. Useful for angles and cyclic indexes.
- [`remapRange`](./src/remap-range/remap-range.md) Maps `value` linearly from `[fromStart, fromEnd]` onto `[toStart, toEnd]`. `amount` is not involved; the source position is the ratio. Set `clamp` to clamp the input to the source range first.
- [`normalize`](./src/normalize/normalize.md) Maps `value` from `[start, end]` onto `[0, 1]`. A zero-length source returns `0` only when `value` is exactly `start`.
- [`getNextPowerOfTwo`](./src/get-next-power-of-two/get-next-power-of-two.md) Returns the smallest power of two that is greater than or equal to a positive finite `value`.
- [`toDegrees`](./src/to-degrees/to-degrees.md) Converts radians to degrees. A non-finite value returns `undefined`.
- [`toRadians`](./src/to-radians/to-radians.md) Converts degrees to radians. A non-finite value returns `undefined`.

### Rounding

- [`roundNumber`](./src/round-number/round-number.md) Rounds `value` to `precision` decimal places. A negative precision rounds to tens, hundreds, and so on. The mode matches `Intl.NumberFormat` and defaults to `halfExpand`.
- [`ceilNumber`](./src/ceil-number/ceil-number.md) Rounds `value` toward positive infinity at `precision` decimal places.
- [`floorNumber`](./src/floor-number/floor-number.md) Rounds `value` toward negative infinity at `precision` decimal places.
- [`truncateNumber`](./src/truncate-number/truncate-number.md) Rounds `value` toward zero at `precision` decimal places.
- [`roundToIncrement`](./src/round-to-increment/round-to-increment.md) Rounds `value` to the nearest multiple of a positive `increment`.
- [`toSignificantDigits`](./src/to-significant-digits/to-significant-digits.md) Rounds `value` to `digits` significant digits.
- [`stripImpreciseRemainder`](./src/strip-imprecise-remainder/strip-imprecise-remainder.md) Replaces a floating-point artifact such as `0.30000000000000004` with the nearby short decimal. Values that are already the intended representation stay unchanged.

### Arithmetic

- [`addPrecise`](./src/add-precise/add-precise.md) Adds two decimal values so that `0.1 + 0.2` is `0.3`. Very large magnitudes or very long fractional parts can still be unrepresentable as a number.
- [`subtractPrecise`](./src/subtract-precise/subtract-precise.md) Subtracts two decimal values. Very large magnitudes or very long fractional parts can still be unrepresentable as a number.
- [`multiplyPrecise`](./src/multiply-precise/multiply-precise.md) Multiplies two decimal values. Very large magnitudes or very long fractional parts can still be unrepresentable as a number.
- [`dividePrecise`](./src/divide-precise/divide-precise.md) Divides two decimal values. A divisor of `0` or `-0` returns `undefined`. A repeating result is rounded to 15 fractional digits, ties away from zero.
- [`sumPrecise`](./src/sum-precise/sum-precise.md) Returns the correctly rounded sum of the exact double values. An empty list is `0`, unlike `Math.sumPrecise`, which returns `-0`. When `Math.sumPrecise` exists it is used for a non-empty list.
- [`areAlmostEqual`](./src/are-almost-equal/are-almost-equal.md) Reports whether two finite numbers are within the absolute or relative tolerance. Defaults are `absoluteTolerance` `0` and `relativeTolerance` `Number.EPSILON * 8`.
- [`getRemainder`](./src/get-remainder/get-remainder.md) Returns the JavaScript remainder. A divisor of `0` or `-0` returns `undefined`.
- [`getModulo`](./src/get-modulo/get-modulo.md) Returns a non-negative remainder for a non-zero divisor. A divisor of zero returns `undefined`.
- [`getQuotientAndRemainder`](./src/get-quotient-and-remainder/get-quotient-and-remainder.md) Returns toward-zero quotient and the JavaScript remainder. A divisor of zero returns `undefined`.
- [`getAbsolute`](./src/get-absolute/get-absolute.md) Returns the absolute value of a finite number.
- [`getSign`](./src/get-sign/get-sign.md) Returns the sign of a finite number, including `-0`. Non-finite values return `undefined`.
- [`getGreatestCommonDivisor`](./src/get-greatest-common-divisor/get-greatest-common-divisor.md) Returns the non-negative greatest common divisor of two or more safe integers.
- [`getLeastCommonMultiple`](./src/get-least-common-multiple/get-least-common-multiple.md) Returns the non-negative least common multiple of two or more safe integers. The result is `undefined` when it would exceed `Number.MAX_SAFE_INTEGER`.
- [`getPercentage`](./src/get-percentage/get-percentage.md) Returns `100 * part / whole`, so a quarter of a whole is `25`. A whole of zero returns `undefined`.
- [`getPercentageChange`](./src/get-percentage-change/get-percentage-change.md) Returns `100 * (to - from) / from`. A `from` of zero returns `undefined`.
- [`applyPercentage`](./src/apply-percentage/apply-percentage.md) Returns `value * (percent / 100)`.
- [`increaseByPercentage`](./src/increase-by-percentage/increase-by-percentage.md) Adds a percentage of `value` to `value`.
- [`decreaseByPercentage`](./src/decrease-by-percentage/decrease-by-percentage.md) Subtracts a percentage of `value` from `value`.
- [`toFraction`](./src/to-fraction/to-fraction.md) Approximates `value` with a continued fraction whose denominator is at most `maximumDenominator`.
- [`fromFraction`](./src/from-fraction/from-fraction.md) Divides a numerator by a denominator. A denominator of zero returns `undefined`.

### Random numbers

- [`randomInteger`](./src/random-integer/random-integer.md) Returns an integer in the range. `includeUpper` defaults to `true`. Not cryptographically secure. Pass `random` to supply a float in `[0, 1)`.
- [`randomNumber`](./src/random-number/random-number.md) Returns a float in the range. `includeUpper` defaults to `false`. Not cryptographically secure.
- [`createUniqueRandomInteger`](./src/create-unique-random-integer/create-unique-random-integer.md) Returns a function that yields each integer in the range once, then starts again. Not cryptographically secure.
- [`createSeededRandom`](./src/create-seeded-random/create-seeded-random.md) Returns a deterministic generator for a numeric or string seed. The same seed produces the same sequence. Not for secrets.
- [`randomGaussian`](./src/random-gaussian/random-gaussian.md) Returns a normal sample using the Box-Muller transform. Not cryptographically secure. A non-positive finite `standardDeviation` returns `undefined`.
- [`randomIntegerSecure`](./src/random-integer-secure/random-integer-secure.md) Returns a uniform integer using `crypto.getRandomValues`.
- [`randomNumberSecure`](./src/random-number-secure/random-number-secure.md) Returns a float in the range using `crypto.getRandomValues`. `includeUpper` defaults to `false`.

### Statistics

- [`sum`](./src/sum/sum.md) Sums finite numbers with sumPrecise. An empty list is `0`.
- [`product`](./src/product/product.md) Multiplies finite numbers. An empty list is `1`.
- [`mean`](./src/mean/mean.md) Returns the arithmetic mean. An empty list returns `undefined`.
- [`median`](./src/median/median.md) Returns the median of a copy of `values`. The input is not mutated. An empty list or a non-finite value returns `undefined`.
- [`getMode`](./src/get-mode/get-mode.md) Returns the unique most frequent finite value. An empty list or a tie returns `undefined`.
- [`getModes`](./src/get-modes/get-modes.md) Returns every finite value with the highest frequency, sorted ascending. An empty list or a non-finite value returns an empty list.
- [`getPercentile`](./src/get-percentile/get-percentile.md) Returns a percentile from 0 to 100. The default method is `linear`, Hyndman-Fan type 7. `inclusive` uses the same positions. `exclusive` is type 6.
- [`getQuantile`](./src/get-quantile/get-quantile.md) Returns a quantile for a probability from 0 to 1. The default method is `linear`.
- [`getQuartiles`](./src/get-quartiles/get-quartiles.md) Returns the 25%, 50%, and 75% points using the linear quantile method.
- [`getInterquartileRange`](./src/get-interquartile-range/get-interquartile-range.md) Returns the distance between the upper and lower quartiles.
- [`getVariance`](./src/get-variance/get-variance.md) Returns the variance. `sample` defaults to `true` and divides by `n - 1`. A sample with fewer than two values returns `undefined`. Population variance needs at least one value.
- [`getStandardDeviation`](./src/get-standard-deviation/get-standard-deviation.md) Returns the square root of getVariance.
- [`getZScore`](./src/get-z-score/get-z-score.md) Returns the z-score from `values`, or from `mean` and `standardDeviation`. A deviation of zero returns `undefined`.
- [`getGeometricMean`](./src/get-geometric-mean/get-geometric-mean.md) Returns the geometric mean. Any value that is not a positive finite number returns `undefined`.
- [`getHarmonicMean`](./src/get-harmonic-mean/get-harmonic-mean.md) Returns the harmonic mean. An empty list or a zero value returns `undefined`.
- [`sumBy`](./src/sum-by/sum-by.md) Sums the finite numbers returned by `iteratee`.
- [`meanBy`](./src/mean-by/mean-by.md) Returns the mean of the numbers returned by `iteratee`.
- [`medianBy`](./src/median-by/median-by.md) Returns the median of the numbers returned by `iteratee`.

### Formatting

- [`formatNumber`](./src/format-number/format-number.md) Formats a finite number with `Intl.NumberFormat`. A non-finite value returns `undefined` and is not printed as `NaN` or infinity.
- [`formatCurrency`](./src/format-currency/format-currency.md) Formats a finite amount as currency. `currency` is required on the call or on a `createNumber` instance.
- [`formatPercent`](./src/format-percent/format-percent.md) Formats a ratio as a percent. `0.25` is 25 percent. This is the opposite direction from parsePercent.
- [`formatCompactNumber`](./src/format-compact-number/format-compact-number.md) Formats a finite number in compact notation. `compactDisplay` defaults to `short`. Indian locales already use lakh and crore units.
- [`formatOrdinal`](./src/format-ordinal/format-ordinal.md) Formats the integer part of a finite number as an ordinal. English uses st, nd, rd, and th. French uses er and e. German uses a trailing period. Other locales return the formatted integer.
- [`formatBytes`](./src/format-bytes/format-bytes.md) Formats a byte count, or a bit count when `bits` is true. SI steps by 1000 and IEC by 1024. A unit the runtime cannot name falls back to an English symbol such as `KiB`.
- [`formatUnit`](./src/format-unit/format-unit.md) Formats a finite number with an `Intl` unit.
- [`formatEngineeringNotation`](./src/format-engineering-notation/format-engineering-notation.md) Formats a finite number with an exponent that is a multiple of 3. `maximumSignificantDigits` defaults to 3.
- [`formatScientificNotation`](./src/format-scientific-notation/format-scientific-notation.md) Formats a finite number in scientific notation.
- [`formatNumberRange`](./src/format-number-range/format-number-range.md) Formats a finite numeric range. Uses `Intl.NumberFormat.formatRange` when it exists, otherwise joins the two formatted numbers with an en dash.
- [`getNumberFormatParts`](./src/get-number-format-parts/get-number-format-parts.md) Returns the `Intl.NumberFormatPart` list for a finite number.
- [`getLocaleNumberSymbols`](./src/get-locale-number-symbols/get-locale-number-symbols.md) Returns the decimal, group, sign, percent, infinity, NaN, and exponent characters for a locale.
- [`getCurrencySymbol`](./src/get-currency-symbol/get-currency-symbol.md) Returns the currency symbol, narrow symbol, code, or name.

### Bases and Roman numerals

- [`toBase`](./src/to-base/to-base.md) Converts an integer to digits in a base from 2 to 36. A bigint keeps full precision. A number outside the safe integer range returns `undefined`.
- [`fromBase`](./src/from-base/from-base.md) Parses digits in a base from 2 to 36. A safe integer is a number. A larger integer is a bigint.
- [`formatBinary`](./src/format-binary/format-binary.md) Formats an integer as binary. `prefix` defaults to `true`.
- [`formatHexadecimal`](./src/format-hexadecimal/format-hexadecimal.md) Formats an integer as hexadecimal. `prefix` defaults to `true` and `uppercase` defaults to `false`.
- [`formatOctal`](./src/format-octal/format-octal.md) Formats an integer as octal. `prefix` defaults to `true`.
- [`parseBinary`](./src/parse-binary/parse-binary.md) Parses a binary integer, with an optional `0b` prefix.
- [`parseHexadecimal`](./src/parse-hexadecimal/parse-hexadecimal.md) Parses a hexadecimal integer, with an optional `0x` prefix.
- [`parseOctal`](./src/parse-octal/parse-octal.md) Parses an octal integer, with an optional `0o` prefix.
- [`toRomanNumeral`](./src/to-roman-numeral/to-roman-numeral.md) Converts an integer to a Roman numeral. Standard numerals cover 1 to 3999. `style: "extended"` covers 1 to 3999999 using parentheses for thousands, so 4000 is `(IV)`.
- [`fromRomanNumeral`](./src/from-roman-numeral/from-roman-numeral.md) Parses a case-insensitive Roman numeral. Standard subtractive forms are accepted. Empty text and invalid sequences such as `IIX` return `undefined`. The extended parenthetical form is accepted.

### BigInt

- [`isBigInt`](./src/is-big-int/is-big-int.md) Reports whether `value` is a bigint.
- [`toBigInt`](./src/to-big-int/to-big-int.md) Converts a safe integer, an integer string, or a bigint to a bigint. Non-integers and other strings return `undefined`.
- [`bigIntToNumber`](./src/big-int-to-number/big-int-to-number.md) Converts a bigint to a number when it is inside the safe integer range.
- [`isSafeNumberBigInt`](./src/is-safe-number-big-int/is-safe-number-big-int.md) Reports whether a bigint is inside the safe integer range.
- [`clampBigInt`](./src/clamp-big-int/clamp-big-int.md) Clamps a bigint to an inclusive range.
- [`isInRangeBigInt`](./src/is-in-range-big-int/is-in-range-big-int.md) Reports whether a bigint lies in a half-open range by default.
- [`createBigIntRange`](./src/create-big-int-range/create-big-int-range.md) Creates the half-open bigint sequence `[start, end)`. `step` defaults to `1n`. A sequence longer than 1000000 throws.
- [`sumBigInt`](./src/sum-big-int/sum-big-int.md) Sums bigints. An empty list is `0n`.
- [`getMinimumBigInt`](./src/get-minimum-big-int/get-minimum-big-int.md) Returns the smallest bigint. An empty list returns `undefined`.
- [`getMaximumBigInt`](./src/get-maximum-big-int/get-maximum-big-int.md) Returns the largest bigint. An empty list returns `undefined`.
- [`randomBigInt`](./src/random-big-int/random-big-int.md) Returns a bigint in the range. `includeUpper` defaults to `true`. Not cryptographically secure.
- [`getGreatestCommonDivisorBigInt`](./src/get-greatest-common-divisor-big-int/get-greatest-common-divisor-big-int.md) Returns the non-negative greatest common divisor of two or more bigints.
- [`getLeastCommonMultipleBigInt`](./src/get-least-common-multiple-big-int/get-least-common-multiple-big-int.md) Returns the non-negative least common multiple of two or more bigints.

### Interpolation

- [`interpolateLinear`](./src/interpolate-linear/interpolate-linear.md) Returns `start + (end - start) * amount`. `amount` is not clamped, so the result can leave the segment.
- [`interpolateInverse`](./src/interpolate-inverse/interpolate-inverse.md) Returns the amount that maps `start` to `end` through `value`. When all three are equal the result is `0`.
- [`interpolateSmoothstep`](./src/interpolate-smoothstep/interpolate-smoothstep.md) Interpolates with the Hermite smoothstep curve after clamping `amount` to `[0, 1]`.
- [`interpolateSmootherstep`](./src/interpolate-smootherstep/interpolate-smootherstep.md) Interpolates with the Ken Perlin smootherstep curve after clamping `amount` to `[0, 1]`.
- [`damp`](./src/damp/damp.md) Frame-rate independent exponential smoothing. `smoothing` is the time constant in the same unit as `deltaTime`. After one time constant, about 37% of the gap remains. A smoothing of `0` snaps to `target`.
- [`interpolateAngle`](./src/interpolate-angle/interpolate-angle.md) Interpolates the shortest path around a circle. `unit` is `radians` by default, or `degrees`.
- [`interpolateAlongValues`](./src/interpolate-along-values/interpolate-along-values.md) Walks a piecewise-linear path through `values` as `amount` goes from 0 to 1. Amounts outside that interval extrapolate from the first or last segment.

### Factory

- [`createNumber`](./src/create-number/create-number.md) Returns a frozen set of root number helpers with `config` bound in.

### Number words

Import a locale subpath. There is no `@sgx4u/number/words` barrel.

- [`toWords`](./src/words/en/to-words/to-words.md) on `@sgx4u/number/words/en` and [`toWords`](./src/words/en-IN/to-words/to-words.md) on `@sgx4u/number/words/en-IN`.
- [`toOrdinalWords`](./src/words/en/to-ordinal-words/to-ordinal-words.md) on `@sgx4u/number/words/en` and [`toOrdinalWords`](./src/words/en-IN/to-ordinal-words/to-ordinal-words.md) on `@sgx4u/number/words/en-IN`.
- [`toCurrencyWords`](./src/words/en/to-currency-words/to-currency-words.md) on `@sgx4u/number/words/en` and [`toCurrencyWords`](./src/words/en-IN/to-currency-words/to-currency-words.md) on `@sgx4u/number/words/en-IN`.
- [`fromWords`](./src/words/en/from-words/from-words.md) on `@sgx4u/number/words/en` and [`fromWords`](./src/words/en-IN/from-words/from-words.md) on `@sgx4u/number/words/en-IN`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="runtime-support">🌐 Runtime support</h2>

Runtime: `universal`. The same source runs in browsers, workers, and Node. It uses `Intl`, `Math`, and `crypto.getRandomValues` when a secure helper is called. It has no runtime dependencies.

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
