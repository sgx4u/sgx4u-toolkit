import { describe, expect, it } from "vitest";
import {
    createBigIntRange,
    createNumber,
    createRange,
    fromBase,
    fromFraction,
    fromRomanNumeral,
    getLeastCommonMultiple,
    getLeastCommonMultipleBigInt,
    getNextPowerOfTwo,
    getPercentageChange,
    getQuantile,
    increaseByPercentage,
    parseBytes,
    parseCurrency,
    parseLocaleNumber,
    randomBigInt,
    randomGaussian,
    randomIntegerSecure,
    randomNumber,
    roundNumber,
    toFraction,
} from "./index.js";
import {
    fromWords,
    toCurrencyWords,
    toOrdinalWords,
    toWords,
} from "./words/en.js";
import {
    fromWords as indianFromWords,
    toCurrencyWords as indianCurrencyWords,
    toWords as indianWords,
} from "./words/en-IN.js";
import {
    nextDownValue,
    numberFromScaledInteger,
} from "./utils/float-bits.utils.js";

describe("additional behavior", () => {
    it("reconstructs extreme floating-point sums", () => {
        expect(numberFromScaledInteger(1, 0n, 0)).toBe(0);
        expect(Object.is(numberFromScaledInteger(-1, 0n, 0), -0)).toBe(true);
        expect(numberFromScaledInteger(1, 1n, 2000)).toBe(
            Number.POSITIVE_INFINITY,
        );
        expect(numberFromScaledInteger(-1, 1n, 2000)).toBe(
            Number.NEGATIVE_INFINITY,
        );
        expect(numberFromScaledInteger(1, 1n, -1074)).toBe(Number.MIN_VALUE);
        expect(numberFromScaledInteger(-1, 1n, -1074)).toBe(-Number.MIN_VALUE);
        expect(numberFromScaledInteger(1, 1n << 80n, -1200)).toBeTypeOf(
            "number",
        );
        expect(nextDownValue(0)).toBe(-Number.MIN_VALUE);
        expect(nextDownValue(-2)).toBeLessThan(-2);
        expect(getNextPowerOfTwo(Number.MAX_VALUE)).toBeUndefined();
    });

    it("covers quantile methods and percentage edges", () => {
        const values = [1, 2, 3, 4, 5, 6, 7, 8];
        expect(
            getQuantile({ values, probability: 0.5, method: "nearest" }),
        ).toBeTypeOf("number");
        expect(
            getQuantile({ values, probability: 0.5, method: "midpoint" }),
        ).toBeTypeOf("number");
        expect(
            getQuantile({ values, probability: 0.25, method: "higher" }),
        ).toBeTypeOf("number");
        expect(
            getQuantile({ values, probability: 0.25, method: "lower" }),
        ).toBeTypeOf("number");
        expect(
            getQuantile({ values, probability: 0.5, method: "exclusive" }),
        ).toBeTypeOf("number");
        expect(
            getQuantile({ values: [1, Number.NaN], probability: 0.5 }),
        ).toBeUndefined();
        expect(getPercentageChange({ from: 80, to: 40 })).toBe(-50);
        expect(
            increaseByPercentage({ value: Number.NaN, percent: 10 }),
        ).toBeUndefined();
    });

    it("covers words, currency fallback, and Roman leftovers", () => {
        expect(toWords({ value: 101, kind: "ordinal" })).toBe(
            "one hundred first",
        );
        expect(toOrdinalWords({ value: 100 })).toBe("one hundredth");
        expect(toOrdinalWords({ value: 20 })).toBe("twentieth");
        expect(toOrdinalWords({ value: 1000 })).toBe("one thousandth");
        expect(fromWords({ value: "twentieth" })).toBe(20);
        expect(fromWords({ value: "hundredth" })).toBe(100);
        expect(() => createRange({ start: 3, end: 0 })).toThrow(RangeError);
        expect(() => createBigIntRange({ start: 3n, end: 0n })).toThrow(
            RangeError,
        );
        expect(toWords({ value: 1.25 })).toBe("one point two five");
        expect(toCurrencyWords({ value: 1.5, currency: "USD" })).toContain(
            "cent",
        );
        expect(toCurrencyWords({ value: -2, currency: "EUR" })).toContain(
            "minus",
        );
        expect(toCurrencyWords({ value: 1, currency: "XYZ" })).toContain("XYZ");
        expect(
            toCurrencyWords({ value: -1, currency: "USD", style: "cheque" }),
        ).toBeUndefined();
        expect(indianWords({ value: 1_00_00_000 })).toContain("crore");
        expect(
            indianCurrencyWords({
                value: 1.5,
                currency: "INR",
                style: "cheque",
            }),
        ).toContain("Paise");
        expect(indianFromWords({ value: "one lakh" })).toBe(100000);
        expect(fromWords({ value: "one hundred and one" })).toBe(101);
        expect(fromWords({ value: "one thousand two hundred" })).toBe(1200);
        expect(fromRomanNumeral("IIII")).toBeUndefined();
        expect(fromRomanNumeral("(IIX)")).toBeUndefined();
        expect(
            toWords({ value: 1, kind: "other" as "cardinal" }),
        ).toBeUndefined();
    });

    it("covers bases, bytes, ranges, fractions, and config errors", () => {
        expect(fromBase({ value: "0b10", base: 10 })).toBeUndefined();
        expect(fromBase({ value: "-ff", base: 16 })).toBe(-255);
        expect(parseBytes({ value: "2 MiB" })).toBe(2 * 1024 * 1024);
        expect(parseBytes({ value: "1 MB", standard: "IEC" })).toBe(
            1024 * 1024,
        );
        expect(parseCurrency({ value: "₹1,000", locale: "en-IN" })).toBe(1000);
        expect(
            parseLocaleNumber({ value: "25%", locale: "en-US" }),
        ).toBeUndefined();
        expect(() => createRange({ start: Number.NaN, end: 1 })).toThrow(
            RangeError,
        );
        expect(toFraction({ value: -0.5, maximumDenominator: 10 })).toEqual({
            numerator: -1,
            denominator: 2,
        });
        expect(fromFraction({ numerator: 1, denominator: -2 })).toBe(-0.5);
        expect(getLeastCommonMultiple({ values: [0, 4] })).toBe(0);
        expect(getLeastCommonMultipleBigInt({ values: [0n, 4n] })).toBe(0n);
        expect(roundNumber({ value: 1.5, mode: "halfFloor" })).toBe(1);
        expect(roundNumber({ value: -1.2, mode: "expand" })).toBe(-2);
        expect(roundNumber({ value: 1.2, mode: "ceil" })).toBe(2);
        expect(() =>
            createNumber({ useGrouping: "sometimes" as "auto" }),
        ).toThrow(RangeError);
        expect(() => createNumber({ absoluteTolerance: -1 })).toThrow(
            RangeError,
        );
        expect(() => createNumber({ numberingSystem: "nope" })).toThrow(
            RangeError,
        );
        expect(() =>
            createNumber({ percentileMethod: "nope" as "linear" }),
        ).toThrow(RangeError);
    });

    it("covers random edges and a missing crypto implementation", () => {
        expect(
            randomNumber({
                lower: 0,
                upper: 1,
                includeUpper: true,
                random: () => 0,
            }),
        ).toBe(0);
        expect(
            randomGaussian({ mean: Number.NaN, random: () => 0.5 }),
        ).toBeUndefined();
        expect(
            randomBigInt({
                lower: 0n,
                upper: 1n << 40n,
                includeUpper: true,
                random: () => 0.25,
            }),
        ).toBeGreaterThanOrEqual(0n);
        const descriptor = Object.getOwnPropertyDescriptor(
            globalThis,
            "crypto",
        );
        Object.defineProperty(globalThis, "crypto", {
            configurable: true,
            value: undefined,
        });
        expect(() => randomIntegerSecure({ lower: 0, upper: 1 })).toThrow(
            Error,
        );
        if (descriptor === undefined) {
            delete (globalThis as { crypto?: unknown }).crypto;
        } else {
            Object.defineProperty(globalThis, "crypto", descriptor);
        }
    });
});
