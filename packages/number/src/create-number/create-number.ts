import type { ByteStandard } from "../types/byte-standard.types.js";
import type {
    CompactDisplay,
    CurrencyDisplay,
    SignDisplay,
    TrailingZeroDisplay,
    UseGrouping,
} from "../types/format-display.types.js";
import type { NumberConfig } from "../types/number-config.types.js";
import type { QuantileMethod } from "../types/quantile-method.types.js";
import type { RoundingMode } from "../types/rounding-mode.types.js";
import type { NumberInstance } from "./create-number.types.js";
import { defaultRelativeTolerance } from "../constants/number-defaults.constants.js";
import { quantileMethods } from "../constants/quantile-methods.constants.js";
import { roundingModes } from "../constants/rounding-modes.constants.js";
import {
    assertCurrency,
    assertLocale,
    assertNumberingSystem,
} from "../utils/intl-locale.utils.js";
import { addPrecise } from "../add-precise/add-precise.js";
import { applyPercentage } from "../apply-percentage/apply-percentage.js";
import { areAlmostEqual } from "../are-almost-equal/are-almost-equal.js";
import { bigIntToNumber } from "../big-int-to-number/big-int-to-number.js";
import { ceilNumber } from "../ceil-number/ceil-number.js";
import { clamp } from "../clamp/clamp.js";
import { clampBigInt } from "../clamp-big-int/clamp-big-int.js";
import { compareNumbers } from "../compare-numbers/compare-numbers.js";
import { createBigIntRange } from "../create-big-int-range/create-big-int-range.js";
import { createInclusiveRange } from "../create-inclusive-range/create-inclusive-range.js";
import { createRange } from "../create-range/create-range.js";
import { createSeededRandom } from "../create-seeded-random/create-seeded-random.js";
import { createUniqueRandomInteger } from "../create-unique-random-integer/create-unique-random-integer.js";
import { damp } from "../damp/damp.js";
import { decreaseByPercentage } from "../decrease-by-percentage/decrease-by-percentage.js";
import { dividePrecise } from "../divide-precise/divide-precise.js";
import { floorNumber } from "../floor-number/floor-number.js";
import { formatBinary } from "../format-binary/format-binary.js";
import { formatBytes } from "../format-bytes/format-bytes.js";
import { formatCompactNumber } from "../format-compact-number/format-compact-number.js";
import { formatCurrency } from "../format-currency/format-currency.js";
import { formatEngineeringNotation } from "../format-engineering-notation/format-engineering-notation.js";
import { formatHexadecimal } from "../format-hexadecimal/format-hexadecimal.js";
import { formatNumber } from "../format-number/format-number.js";
import { formatNumberRange } from "../format-number-range/format-number-range.js";
import { formatOctal } from "../format-octal/format-octal.js";
import { formatOrdinal } from "../format-ordinal/format-ordinal.js";
import { formatPercent } from "../format-percent/format-percent.js";
import { formatScientificNotation } from "../format-scientific-notation/format-scientific-notation.js";
import { formatUnit } from "../format-unit/format-unit.js";
import { fromBase } from "../from-base/from-base.js";
import { fromFraction } from "../from-fraction/from-fraction.js";
import { fromRomanNumeral } from "../from-roman-numeral/from-roman-numeral.js";
import { getAbsolute } from "../get-absolute/get-absolute.js";
import { getCurrencySymbol } from "../get-currency-symbol/get-currency-symbol.js";
import { getExtent } from "../get-extent/get-extent.js";
import { getGeometricMean } from "../get-geometric-mean/get-geometric-mean.js";
import { getGreatestCommonDivisor } from "../get-greatest-common-divisor/get-greatest-common-divisor.js";
import { getGreatestCommonDivisorBigInt } from "../get-greatest-common-divisor-big-int/get-greatest-common-divisor-big-int.js";
import { getHarmonicMean } from "../get-harmonic-mean/get-harmonic-mean.js";
import { getInterquartileRange } from "../get-interquartile-range/get-interquartile-range.js";
import { getLeastCommonMultiple } from "../get-least-common-multiple/get-least-common-multiple.js";
import { getLeastCommonMultipleBigInt } from "../get-least-common-multiple-big-int/get-least-common-multiple-big-int.js";
import { getLocaleNumberSymbols } from "../get-locale-number-symbols/get-locale-number-symbols.js";
import { getMaximum } from "../get-maximum/get-maximum.js";
import { getMaximumBigInt } from "../get-maximum-big-int/get-maximum-big-int.js";
import { getMinimum } from "../get-minimum/get-minimum.js";
import { getMinimumBigInt } from "../get-minimum-big-int/get-minimum-big-int.js";
import { getMode } from "../get-mode/get-mode.js";
import { getModes } from "../get-modes/get-modes.js";
import { getModulo } from "../get-modulo/get-modulo.js";
import { getNextPowerOfTwo } from "../get-next-power-of-two/get-next-power-of-two.js";
import { getNumberFormatParts } from "../get-number-format-parts/get-number-format-parts.js";
import { getPercentage } from "../get-percentage/get-percentage.js";
import { getPercentageChange } from "../get-percentage-change/get-percentage-change.js";
import { getPercentile } from "../get-percentile/get-percentile.js";
import { getQuantile } from "../get-quantile/get-quantile.js";
import { getQuartiles } from "../get-quartiles/get-quartiles.js";
import { getQuotientAndRemainder } from "../get-quotient-and-remainder/get-quotient-and-remainder.js";
import { getRemainder } from "../get-remainder/get-remainder.js";
import { getSign } from "../get-sign/get-sign.js";
import { getStandardDeviation } from "../get-standard-deviation/get-standard-deviation.js";
import { getVariance } from "../get-variance/get-variance.js";
import { getZScore } from "../get-z-score/get-z-score.js";
import { increaseByPercentage } from "../increase-by-percentage/increase-by-percentage.js";
import { interpolateAlongValues } from "../interpolate-along-values/interpolate-along-values.js";
import { interpolateAngle } from "../interpolate-angle/interpolate-angle.js";
import { interpolateInverse } from "../interpolate-inverse/interpolate-inverse.js";
import { interpolateLinear } from "../interpolate-linear/interpolate-linear.js";
import { interpolateSmootherstep } from "../interpolate-smootherstep/interpolate-smootherstep.js";
import { interpolateSmoothstep } from "../interpolate-smoothstep/interpolate-smoothstep.js";
import { isBigInt } from "../is-big-int/is-big-int.js";
import { isEven } from "../is-even/is-even.js";
import { isFiniteNumber } from "../is-finite-number/is-finite-number.js";
import { isInRange } from "../is-in-range/is-in-range.js";
import { isInRangeBigInt } from "../is-in-range-big-int/is-in-range-big-int.js";
import { isInteger } from "../is-integer/is-integer.js";
import { isMultipleOf } from "../is-multiple-of/is-multiple-of.js";
import { isNaNNumber } from "../is-nan-number/is-nan-number.js";
import { isNegative } from "../is-negative/is-negative.js";
import { isNonNegative } from "../is-non-negative/is-non-negative.js";
import { isNonPositive } from "../is-non-positive/is-non-positive.js";
import { isNumber } from "../is-number/is-number.js";
import { isOdd } from "../is-odd/is-odd.js";
import { isPositive } from "../is-positive/is-positive.js";
import { isPowerOfTwo } from "../is-power-of-two/is-power-of-two.js";
import { isPrime } from "../is-prime/is-prime.js";
import { isSafeInteger } from "../is-safe-integer/is-safe-integer.js";
import { isSafeNumberBigInt } from "../is-safe-number-big-int/is-safe-number-big-int.js";
import { mean } from "../mean/mean.js";
import { meanBy } from "../mean-by/mean-by.js";
import { median } from "../median/median.js";
import { medianBy } from "../median-by/median-by.js";
import { multiplyPrecise } from "../multiply-precise/multiply-precise.js";
import { normalize } from "../normalize/normalize.js";
import { parseBinary } from "../parse-binary/parse-binary.js";
import { parseBytes } from "../parse-bytes/parse-bytes.js";
import { parseCurrency } from "../parse-currency/parse-currency.js";
import { parseFiniteNumber } from "../parse-finite-number/parse-finite-number.js";
import { parseHexadecimal } from "../parse-hexadecimal/parse-hexadecimal.js";
import { parseInteger } from "../parse-integer/parse-integer.js";
import { parseLocaleNumber } from "../parse-locale-number/parse-locale-number.js";
import { parseNumber } from "../parse-number/parse-number.js";
import { parseOctal } from "../parse-octal/parse-octal.js";
import { parsePercent } from "../parse-percent/parse-percent.js";
import { product } from "../product/product.js";
import { randomBigInt } from "../random-big-int/random-big-int.js";
import { randomGaussian } from "../random-gaussian/random-gaussian.js";
import { randomInteger } from "../random-integer/random-integer.js";
import { randomIntegerSecure } from "../random-integer-secure/random-integer-secure.js";
import { randomNumber } from "../random-number/random-number.js";
import { randomNumberSecure } from "../random-number-secure/random-number-secure.js";
import { remapRange } from "../remap-range/remap-range.js";
import { roundNumber } from "../round-number/round-number.js";
import { roundToIncrement } from "../round-to-increment/round-to-increment.js";
import { stripImpreciseRemainder } from "../strip-imprecise-remainder/strip-imprecise-remainder.js";
import { subtractPrecise } from "../subtract-precise/subtract-precise.js";
import { sum } from "../sum/sum.js";
import { sumBigInt } from "../sum-big-int/sum-big-int.js";
import { sumBy } from "../sum-by/sum-by.js";
import { sumPrecise } from "../sum-precise/sum-precise.js";
import { toBase } from "../to-base/to-base.js";
import { toBigInt } from "../to-big-int/to-big-int.js";
import { toDegrees } from "../to-degrees/to-degrees.js";
import { toFraction } from "../to-fraction/to-fraction.js";
import { toRadians } from "../to-radians/to-radians.js";
import { toRomanNumeral } from "../to-roman-numeral/to-roman-numeral.js";
import { toSignificantDigits } from "../to-significant-digits/to-significant-digits.js";
import { truncateNumber } from "../truncate-number/truncate-number.js";
import { wrapNumber } from "../wrap-number/wrap-number.js";

interface BoundConfig {
    locale?: string | readonly string[];
    currency?: string;
    currencyDisplay: CurrencyDisplay;
    roundingMode: RoundingMode;
    useGrouping: UseGrouping;
    numberingSystem?: string;
    compactDisplay: CompactDisplay;
    signDisplay: SignDisplay;
    trailingZeroDisplay: TrailingZeroDisplay;
    byteStandard: ByteStandard;
    byteStandardExplicit: boolean;
    random: () => number;
    absoluteTolerance: number;
    relativeTolerance: number;
    percentileMethod: QuantileMethod;
}

const currencyDisplays = new Set(["symbol", "narrowSymbol", "code", "name"]);
const signDisplays = new Set([
    "auto",
    "always",
    "exceptZero",
    "negative",
    "never",
]);
const trailingZeroDisplays = new Set(["auto", "stripIfInteger"]);
const compactDisplays = new Set(["short", "long"]);
const byteStandards = new Set(["SI", "IEC"]);
const groupingValues = new Set(["always", "min2", "auto"]);
const roundingModeValues = new Set<string>(roundingModes);
const quantileMethodValues = new Set<string>(quantileMethods);

/**
 * Returns a frozen set of root number helpers with `config` bound in.
 *
 * Per-call properties override the bound values. Instances do not share
 * user-visible state. Word-list helpers are not included.
 *
 * @param config - Defaults used when a call omits them.
 * @returns A frozen instance.
 * @throws {@link RangeError} When a locale, currency, numbering system, or option value is invalid.
 * @throws {@link TypeError} When `random` is not a function.
 * @example
 * const numbers = createNumber({ locale: "en-IN", currency: "INR" });
 */
export function createNumber<Config extends NumberConfig = NumberConfig>(
    config: Config = {} as Config,
): NumberInstance<Config> {
    validateConfig(config);
    const bound: BoundConfig = {
        currencyDisplay: config.currencyDisplay ?? "symbol",
        roundingMode: config.roundingMode ?? "halfExpand",
        useGrouping: config.useGrouping ?? "auto",
        compactDisplay: config.compactDisplay ?? "short",
        signDisplay: config.signDisplay ?? "auto",
        trailingZeroDisplay: config.trailingZeroDisplay ?? "auto",
        byteStandard: config.byteStandard ?? "SI",
        byteStandardExplicit: Object.prototype.hasOwnProperty.call(
            config,
            "byteStandard",
        ),
        random: config.random ?? Math.random,
        absoluteTolerance: config.absoluteTolerance ?? 0,
        relativeTolerance: config.relativeTolerance ?? defaultRelativeTolerance,
        percentileMethod: config.percentileMethod ?? "linear",
    };
    if (config.locale !== undefined) {
        bound.locale = config.locale;
    }
    if (config.currency !== undefined) {
        bound.currency = config.currency;
    }
    if (config.numberingSystem !== undefined) {
        bound.numberingSystem = config.numberingSystem;
    }
    Object.freeze(bound);
    const instance = {
        addPrecise,
        applyPercentage,
        areAlmostEqual: (
            parameters: Parameters<typeof areAlmostEqual>[0],
        ): ReturnType<typeof areAlmostEqual> =>
            areAlmostEqual(
                merge(parameters, {
                    absoluteTolerance: bound.absoluteTolerance,
                    relativeTolerance: bound.relativeTolerance,
                } as Partial<Parameters<typeof areAlmostEqual>[0]>),
            ),
        bigIntToNumber,
        ceilNumber,
        clamp,
        clampBigInt,
        compareNumbers,
        createBigIntRange,
        createInclusiveRange,
        createRange,
        createSeededRandom,
        createUniqueRandomInteger: (
            parameters: Parameters<typeof createUniqueRandomInteger>[0],
        ): ReturnType<typeof createUniqueRandomInteger> =>
            createUniqueRandomInteger(
                merge(parameters, { random: bound.random } as Partial<
                    Parameters<typeof createUniqueRandomInteger>[0]
                >),
            ),
        damp,
        decreaseByPercentage,
        dividePrecise,
        floorNumber,
        formatBinary,
        formatBytes: (
            parameters: Parameters<typeof formatBytes>[0],
        ): ReturnType<typeof formatBytes> =>
            formatBytes(
                merge(parameters, {
                    locale: bound.locale,
                    standard: bound.byteStandard,
                } as Partial<Parameters<typeof formatBytes>[0]>),
            ),
        formatCompactNumber: (
            parameters: Parameters<typeof formatCompactNumber>[0],
        ): ReturnType<typeof formatCompactNumber> =>
            formatCompactNumber(
                merge(
                    parameters,
                    formatDefaults(bound) as Partial<
                        Parameters<typeof formatCompactNumber>[0]
                    >,
                ),
            ),
        formatCurrency: (
            parameters: Omit<
                Parameters<typeof formatCurrency>[0],
                "currency"
            > & { currency?: string },
        ): ReturnType<typeof formatCurrency> => {
            const currency = parameters.currency ?? bound.currency;
            if (currency === undefined) {
                throw new RangeError(
                    "currency is required. Received no currency.",
                );
            }
            return formatCurrency(
                merge({ ...parameters, currency }, {
                    ...formatDefaults(bound),
                    currencyDisplay: bound.currencyDisplay,
                } as Partial<Parameters<typeof formatCurrency>[0]>),
            );
        },
        formatEngineeringNotation: (
            parameters: Parameters<typeof formatEngineeringNotation>[0],
        ): ReturnType<typeof formatEngineeringNotation> =>
            formatEngineeringNotation(
                merge(parameters, { locale: bound.locale } as Partial<
                    Parameters<typeof formatEngineeringNotation>[0]
                >),
            ),
        formatHexadecimal,
        formatNumber: (
            parameters: Parameters<typeof formatNumber>[0],
        ): ReturnType<typeof formatNumber> =>
            formatNumber(
                merge(
                    parameters,
                    formatDefaults(bound) as Partial<
                        Parameters<typeof formatNumber>[0]
                    >,
                ),
            ),
        formatNumberRange: (
            parameters: Parameters<typeof formatNumberRange>[0],
        ): ReturnType<typeof formatNumberRange> =>
            formatNumberRange(
                merge(
                    parameters,
                    formatDefaults(bound) as Partial<
                        Parameters<typeof formatNumberRange>[0]
                    >,
                ),
            ),
        formatOctal,
        formatOrdinal: (
            parameters: Parameters<typeof formatOrdinal>[0],
        ): ReturnType<typeof formatOrdinal> =>
            formatOrdinal(
                merge(parameters, { locale: bound.locale } as Partial<
                    Parameters<typeof formatOrdinal>[0]
                >),
            ),
        formatPercent: (
            parameters: Parameters<typeof formatPercent>[0],
        ): ReturnType<typeof formatPercent> =>
            formatPercent(
                merge(
                    parameters,
                    formatDefaults(bound) as Partial<
                        Parameters<typeof formatPercent>[0]
                    >,
                ),
            ),
        formatScientificNotation: (
            parameters: Parameters<typeof formatScientificNotation>[0],
        ): ReturnType<typeof formatScientificNotation> =>
            formatScientificNotation(
                merge(parameters, { locale: bound.locale } as Partial<
                    Parameters<typeof formatScientificNotation>[0]
                >),
            ),
        formatUnit: (
            parameters: Parameters<typeof formatUnit>[0],
        ): ReturnType<typeof formatUnit> =>
            formatUnit(
                merge(
                    parameters,
                    formatDefaults(bound) as Partial<
                        Parameters<typeof formatUnit>[0]
                    >,
                ),
            ),
        fromBase,
        fromFraction,
        fromRomanNumeral,
        getAbsolute,
        getCurrencySymbol: (
            parameters: Omit<
                Parameters<typeof getCurrencySymbol>[0],
                "currency"
            > & { currency?: string },
        ): ReturnType<typeof getCurrencySymbol> => {
            const currency = parameters.currency ?? bound.currency;
            if (currency === undefined) {
                throw new RangeError(
                    "currency is required. Received no currency.",
                );
            }
            return getCurrencySymbol(
                merge(
                    { ...parameters, currency },
                    {
                        currencyDisplay: bound.currencyDisplay,
                        ...(bound.locale === undefined
                            ? {}
                            : { locale: bound.locale }),
                    },
                ),
            );
        },
        getExtent,
        getGeometricMean,
        getGreatestCommonDivisor,
        getGreatestCommonDivisorBigInt,
        getHarmonicMean,
        getInterquartileRange,
        getLeastCommonMultiple,
        getLeastCommonMultipleBigInt,
        getLocaleNumberSymbols: (
            parameters: Parameters<typeof getLocaleNumberSymbols>[0],
        ): ReturnType<typeof getLocaleNumberSymbols> =>
            getLocaleNumberSymbols(
                merge(parameters, { locale: bound.locale } as Partial<
                    Parameters<typeof getLocaleNumberSymbols>[0]
                >),
            ),
        getMaximum,
        getMaximumBigInt,
        getMinimum,
        getMinimumBigInt,
        getMode,
        getModes,
        getModulo,
        getNextPowerOfTwo,
        getNumberFormatParts: (
            parameters: Parameters<typeof getNumberFormatParts>[0],
        ): ReturnType<typeof getNumberFormatParts> =>
            getNumberFormatParts(
                merge(
                    parameters,
                    formatDefaults(bound) as Partial<
                        Parameters<typeof getNumberFormatParts>[0]
                    >,
                ),
            ),
        getPercentage,
        getPercentageChange,
        getPercentile: (
            parameters: Parameters<typeof getPercentile>[0],
        ): ReturnType<typeof getPercentile> =>
            getPercentile(
                merge(parameters, { method: bound.percentileMethod } as Partial<
                    Parameters<typeof getPercentile>[0]
                >),
            ),
        getQuantile: (
            parameters: Parameters<typeof getQuantile>[0],
        ): ReturnType<typeof getQuantile> =>
            getQuantile(
                merge(parameters, { method: bound.percentileMethod } as Partial<
                    Parameters<typeof getQuantile>[0]
                >),
            ),
        getQuartiles: (
            values: Parameters<typeof getQuartiles>[0],
        ): ReturnType<typeof getQuartiles> => {
            const lower = getPercentile({
                values,
                percentile: 25,
                method: bound.percentileMethod,
            });
            const median = getPercentile({
                values,
                percentile: 50,
                method: bound.percentileMethod,
            });
            const upper = getPercentile({
                values,
                percentile: 75,
                method: bound.percentileMethod,
            });
            if (
                lower === undefined ||
                median === undefined ||
                upper === undefined
            ) {
                return undefined;
            }
            return { lower, median, upper };
        },
        getQuotientAndRemainder,
        getRemainder,
        getSign,
        getStandardDeviation,
        getVariance,
        getZScore,
        increaseByPercentage,
        interpolateAlongValues,
        interpolateAngle,
        interpolateInverse,
        interpolateLinear,
        interpolateSmootherstep,
        interpolateSmoothstep,
        isBigInt,
        isEven,
        isFiniteNumber,
        isInRange,
        isInRangeBigInt,
        isInteger,
        isMultipleOf,
        isNaNNumber,
        isNegative,
        isNonNegative,
        isNonPositive,
        isNumber,
        isOdd,
        isPositive,
        isPowerOfTwo,
        isPrime,
        isSafeInteger,
        isSafeNumberBigInt,
        mean,
        meanBy,
        median,
        medianBy,
        multiplyPrecise,
        normalize,
        parseBinary,
        parseBytes: (
            parameters: Parameters<typeof parseBytes>[0],
        ): ReturnType<typeof parseBytes> =>
            parseBytes(
                merge(
                    parameters,
                    bound.byteStandardExplicit
                        ? { standard: bound.byteStandard }
                        : ({} as Partial<Parameters<typeof parseBytes>[0]>),
                ),
            ),
        parseCurrency: (
            parameters: Parameters<typeof parseCurrency>[0],
        ): ReturnType<typeof parseCurrency> =>
            parseCurrency(
                merge(parameters, {
                    locale: bound.locale,
                    currency: bound.currency,
                } as Partial<Parameters<typeof parseCurrency>[0]>),
            ),
        parseFiniteNumber,
        parseHexadecimal,
        parseInteger,
        parseLocaleNumber: (
            parameters: Parameters<typeof parseLocaleNumber>[0],
        ): ReturnType<typeof parseLocaleNumber> =>
            parseLocaleNumber(
                merge(parameters, { locale: bound.locale } as Partial<
                    Parameters<typeof parseLocaleNumber>[0]
                >),
            ),
        parseNumber,
        parseOctal,
        parsePercent: (
            parameters: Parameters<typeof parsePercent>[0],
        ): ReturnType<typeof parsePercent> =>
            parsePercent(
                merge(parameters, { locale: bound.locale } as Partial<
                    Parameters<typeof parsePercent>[0]
                >),
            ),
        product,
        randomBigInt: (
            parameters: Parameters<typeof randomBigInt>[0],
        ): ReturnType<typeof randomBigInt> =>
            randomBigInt(
                merge(parameters, { random: bound.random } as Partial<
                    Parameters<typeof randomBigInt>[0]
                >),
            ),
        randomGaussian: (
            parameters: Parameters<typeof randomGaussian>[0],
        ): ReturnType<typeof randomGaussian> =>
            randomGaussian(
                merge(parameters, { random: bound.random } as Partial<
                    Parameters<typeof randomGaussian>[0]
                >),
            ),
        randomInteger: (
            parameters: Parameters<typeof randomInteger>[0],
        ): ReturnType<typeof randomInteger> =>
            randomInteger(
                merge(parameters, { random: bound.random } as Partial<
                    Parameters<typeof randomInteger>[0]
                >),
            ),
        randomIntegerSecure,
        randomNumber: (
            parameters: Parameters<typeof randomNumber>[0],
        ): ReturnType<typeof randomNumber> =>
            randomNumber(
                merge(parameters, { random: bound.random } as Partial<
                    Parameters<typeof randomNumber>[0]
                >),
            ),
        randomNumberSecure,
        remapRange,
        roundNumber: (
            parameters: Parameters<typeof roundNumber>[0],
        ): ReturnType<typeof roundNumber> =>
            roundNumber(
                merge(parameters, { mode: bound.roundingMode } as Partial<
                    Parameters<typeof roundNumber>[0]
                >),
            ),
        roundToIncrement: (
            parameters: Parameters<typeof roundToIncrement>[0],
        ): ReturnType<typeof roundToIncrement> =>
            roundToIncrement(
                merge(parameters, { mode: bound.roundingMode } as Partial<
                    Parameters<typeof roundToIncrement>[0]
                >),
            ),
        stripImpreciseRemainder,
        subtractPrecise,
        sum,
        sumBigInt,
        sumBy,
        sumPrecise,
        toBase,
        toBigInt,
        toDegrees,
        toFraction,
        toRadians,
        toRomanNumeral,
        toSignificantDigits: (
            parameters: Parameters<typeof toSignificantDigits>[0],
        ): ReturnType<typeof toSignificantDigits> =>
            toSignificantDigits(
                merge(parameters, { mode: bound.roundingMode } as Partial<
                    Parameters<typeof toSignificantDigits>[0]
                >),
            ),
        truncateNumber,
        wrapNumber,
    };
    return Object.freeze(instance) as NumberInstance<Config>;
}

function formatDefaults(bound: BoundConfig): {
    locale?: string | readonly string[];
    roundingMode: RoundingMode;
    useGrouping: UseGrouping;
    numberingSystem?: string;
    compactDisplay: CompactDisplay;
    signDisplay: SignDisplay;
    trailingZeroDisplay: TrailingZeroDisplay;
} {
    return {
        roundingMode: bound.roundingMode,
        useGrouping: bound.useGrouping,
        compactDisplay: bound.compactDisplay,
        signDisplay: bound.signDisplay,
        trailingZeroDisplay: bound.trailingZeroDisplay,
        ...(bound.locale === undefined ? {} : { locale: bound.locale }),
        ...(bound.numberingSystem === undefined
            ? {}
            : { numberingSystem: bound.numberingSystem }),
    };
}

function merge<Parameters extends object>(
    parameters: Parameters,
    defaults: Partial<Parameters>,
): Parameters {
    const merged: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(defaults)) {
        if (value !== undefined) {
            merged[key] = value;
        }
    }
    for (const [key, value] of Object.entries(parameters)) {
        if (value !== undefined) {
            merged[key] = value;
        }
    }
    return merged as Parameters;
}

function validateConfig(config: NumberConfig): void {
    if (config.locale !== undefined) {
        assertLocale(config.locale);
    }
    if (config.currency !== undefined) {
        assertCurrency(config.currency, config.locale);
    }
    if (config.numberingSystem !== undefined) {
        assertNumberingSystem(config.numberingSystem);
    }
    assertMember(config.roundingMode, roundingModeValues, "roundingMode");
    assertMember(config.currencyDisplay, currencyDisplays, "currencyDisplay");
    assertMember(config.signDisplay, signDisplays, "signDisplay");
    assertMember(
        config.trailingZeroDisplay,
        trailingZeroDisplays,
        "trailingZeroDisplay",
    );
    assertMember(config.compactDisplay, compactDisplays, "compactDisplay");
    assertMember(config.byteStandard, byteStandards, "byteStandard");
    assertMember(
        config.percentileMethod,
        quantileMethodValues,
        "percentileMethod",
    );
    if (
        config.useGrouping !== undefined &&
        typeof config.useGrouping !== "boolean" &&
        !groupingValues.has(config.useGrouping)
    ) {
        throw new RangeError(
            `useGrouping must be a boolean, "always", "min2", or "auto". Received ${JSON.stringify(config.useGrouping)}.`,
        );
    }
    if (config.random !== undefined && typeof config.random !== "function") {
        throw new TypeError(
            `random must be a function. Received ${typeof config.random}.`,
        );
    }
    assertTolerance(config.absoluteTolerance, "absoluteTolerance");
    assertTolerance(config.relativeTolerance, "relativeTolerance");
}

function assertMember(
    value: string | undefined,
    allowed: ReadonlySet<string>,
    argumentName: string,
): void {
    if (value !== undefined && !allowed.has(value)) {
        throw new RangeError(
            `${argumentName} is invalid. Received ${JSON.stringify(value)}.`,
        );
    }
}

function assertTolerance(
    value: number | undefined,
    argumentName: string,
): void {
    if (value !== undefined && (!Number.isFinite(value) || value < 0)) {
        throw new RangeError(
            `${argumentName} must be a finite number of at least 0. Received ${String(value)}.`,
        );
    }
}
