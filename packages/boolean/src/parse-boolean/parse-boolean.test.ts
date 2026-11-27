import fc from "fast-check";
import { describe, expect, expectTypeOf, it } from "vitest";
import { formatBoolean, listBooleanLocales, parseBoolean } from "../index.js";

const truthyTokens = ["true", "t", "yes", "y", "on", "1", "enable", "enabled"];
const falsyTokens = [
    "false",
    "f",
    "no",
    "n",
    "off",
    "0",
    "disable",
    "disabled",
];

describe("recognized values", () => {
    it.each(truthyTokens)(
        "accepts %s in any case and with surrounding space",
        (token) => {
            expect(parseBoolean(token)).toBe(true);
            expect(parseBoolean(token.toUpperCase())).toBe(true);
            expect(parseBoolean(`  ${token}  `)).toBe(true);
        },
    );

    it.each(falsyTokens)(
        "accepts %s in any case and with surrounding space",
        (token) => {
            expect(parseBoolean(token)).toBe(false);
            expect(parseBoolean(token.toUpperCase())).toBe(false);
            expect(parseBoolean(`\t${token}\n`)).toBe(false);
        },
    );

    it("accepts primitive booleans and the numbers 0 and 1", () => {
        expect(parseBoolean(true)).toBe(true);
        expect(parseBoolean(false)).toBe(false);
        expect(parseBoolean(0)).toBe(false);
        expect(parseBoolean(-0)).toBe(false);
        expect(parseBoolean(1)).toBe(true);
        expect(parseBoolean(1.0)).toBe(true);
    });
});

describe("unrecognized values", () => {
    it("returns undefined for values that are not tokens", () => {
        const rejected: readonly unknown[] = [
            null,
            undefined,
            "",
            "   ",
            "maybe",
            "2",
            "1.0",
            "00",
            "+1",
            "0x1",
            Number.NaN,
            2,
            -1,
            Number.POSITIVE_INFINITY,
            new Boolean(true),
            new Boolean(false),
            {},
            [],
            { yes: true },
            ["true"],
        ];
        for (const value of rejected) {
            expect(parseBoolean(value)).toBeUndefined();
        }
    });

    it("returns fallback when one is provided", () => {
        expect(parseBoolean({ value: "maybe", fallback: false })).toBe(false);
        expect(parseBoolean({ value: "maybe", fallback: true })).toBe(true);
        expect(parseBoolean({ value: "yes", fallback: false })).toBe(true);
        expectTypeOf(
            parseBoolean({ value: "maybe", fallback: false }),
        ).toEqualTypeOf<boolean>();
        expectTypeOf(parseBoolean("yes")).toEqualTypeOf<boolean | undefined>();
    });
});

describe("options", () => {
    it("can turn trim and case folding off", () => {
        expect(parseBoolean({ value: "  yes  ", trim: false })).toBeUndefined();
        expect(
            parseBoolean({
                value: " yes ",
                trim: false,
                truthyWords: [" yes "],
            }),
        ).toBe(true);
        expect(
            parseBoolean({ value: "YES", caseSensitive: true }),
        ).toBeUndefined();
        expect(parseBoolean({ value: "yes", caseSensitive: true })).toBe(true);
        expect(
            parseBoolean({ value: " Yes ", caseSensitive: true, trim: true }),
        ).toBeUndefined();
    });

    it("extends and replaces word lists", () => {
        expect(parseBoolean({ value: "oui", truthyWords: ["oui"] })).toBe(true);
        expect(parseBoolean({ value: "yes", truthyWords: ["oui"] })).toBe(true);
        expect(
            parseBoolean({
                value: "yes",
                wordListMode: "replace",
                truthyWords: ["oui"],
            }),
        ).toBeUndefined();
        expect(
            parseBoolean({
                value: "oui",
                wordListMode: "replace",
                truthyWords: ["oui"],
            }),
        ).toBe(true);
        expect(
            parseBoolean({
                value: true,
                wordListMode: "replace",
                truthyWords: [],
                falsyWords: [],
            }),
        ).toBe(true);
        expect(parseBoolean({ value: 0, wordListMode: "replace" })).toBe(false);
        expect(parseBoolean({ value: 1, wordListMode: "replace" })).toBe(true);
        expect(
            parseBoolean({
                value: "true",
                wordListMode: "replace",
                falsyWords: ["true"],
            }),
        ).toBe(false);
        expect(
            parseBoolean({
                value: true,
                wordListMode: "replace",
                falsyWords: ["true"],
            }),
        ).toBe(true);
    });

    it("does not mutate a custom word list", () => {
        const truthyWords = ["custom"];
        parseBoolean({ value: "custom", truthyWords });
        expect(truthyWords).toEqual(["custom"]);
    });

    it("skips empty words and deduplicates one side", () => {
        expect(
            parseBoolean({
                value: "",
                truthyWords: ["  ", "yes"],
            }),
        ).toBeUndefined();
        expect(
            parseBoolean({
                value: "yes",
                truthyWords: ["yes", "YES"],
            }),
        ).toBe(true);
    });

    it("throws when truthy and falsy words overlap", () => {
        expect(() =>
            parseBoolean({ value: "yes", truthyWords: ["no"] }),
        ).toThrow(RangeError);
        expect(() =>
            parseBoolean({ value: "yes", truthyWords: ["no"] }),
        ).toThrow(/overlap on "no"/);
        expect(() =>
            parseBoolean({
                value: "a",
                truthyWords: ["A"],
                falsyWords: ["a"],
            }),
        ).toThrow(RangeError);
        expect(() =>
            parseBoolean({
                value: "no",
                caseSensitive: true,
                truthyWords: ["NO"],
            }),
        ).not.toThrow();
        expect(
            parseBoolean({
                value: "NO",
                caseSensitive: true,
                truthyWords: ["NO"],
            }),
        ).toBe(true);
        expect(() =>
            parseBoolean({
                value: "maybe",
                wordListMode: "replace",
                truthyWords: ["maybe"],
                falsyWords: ["Maybe"],
            }),
        ).toThrow(/overlap on "maybe"/);
        expect(() =>
            parseBoolean({
                value: "hayır",
                locale: "tr",
                truthyWords: ["HAYIR"],
            }),
        ).toThrow(RangeError);
    });

    it("throws when an option has the wrong type", () => {
        const rejected: readonly unknown[] = [
            { value: "yes", lenient: 1 },
            { value: "yes", lenient: 1n },
            { value: "yes", lenient: Symbol("yes") },
            { value: "yes", lenient: () => true },
            { value: "yes", lenient: null },
            { value: "yes", lenient: {} },
            { value: "yes", lenient: [] },
            { value: "yes", locale: 1 },
            { value: "yes", locale: null },
            { value: "yes", wordListMode: "merge" },
            { value: "yes", wordListMode: true },
            { value: "yes", caseSensitive: "no" },
            { value: "yes", trim: "yes" },
            { value: "yes", truthyWords: "yes" },
            { value: "yes", falsyWords: { 0: "no" } },
            { value: "yes", truthyWords: ["yes", 1] },
            { value: "yes", truthyWords: [undefined] },
            { value: "yes", fallback: "false" },
        ];
        for (const input of rejected) {
            expect(() => parseBoolean(input as never)).toThrow(TypeError);
        }
    });
});

describe("locales", () => {
    it("reads the language subtag and the curated yes/no words", () => {
        expect(parseBoolean({ value: "हाँ", locale: "hi" })).toBe(true);
        expect(parseBoolean({ value: "हां", locale: "hi-IN" })).toBe(true);
        expect(parseBoolean({ value: "जी", locale: "hi" })).toBe(true);
        expect(parseBoolean({ value: "नहीं", locale: "hi" })).toBe(false);
        expect(parseBoolean({ value: "ना", locale: "hi" })).toBe(false);
        expect(parseBoolean({ value: "হ্যাঁ", locale: "bn" })).toBe(true);
        expect(parseBoolean({ value: "না", locale: "bn" })).toBe(false);
        expect(parseBoolean({ value: "ja", locale: "de" })).toBe(true);
        expect(parseBoolean({ value: "JA", locale: "de" })).toBe(true);
        expect(parseBoolean({ value: "nein", locale: "de" })).toBe(false);
        expect(parseBoolean({ value: "sí", locale: "es" })).toBe(true);
        expect(parseBoolean({ value: "si", locale: "es" })).toBe(true);
        expect(parseBoolean({ value: "SÍ", locale: "es" })).toBe(true);
        expect(parseBoolean({ value: "no", locale: "es" })).toBe(false);
        expect(parseBoolean({ value: "oui", locale: "fr" })).toBe(true);
        expect(parseBoolean({ value: "OUI", locale: "fr-CA" })).toBe(true);
        expect(parseBoolean({ value: "non", locale: "fr" })).toBe(false);
        expect(parseBoolean({ value: "はい", locale: "ja" })).toBe(true);
        expect(parseBoolean({ value: "いいえ", locale: "ja" })).toBe(false);
        expect(parseBoolean({ value: "نعم", locale: "ar" })).toBe(true);
        expect(parseBoolean({ value: "لا", locale: "ar" })).toBe(false);
        expect(parseBoolean({ value: "是", locale: "zh-Hans" })).toBe(true);
        expect(parseBoolean({ value: "对", locale: "zh" })).toBe(true);
        expect(parseBoolean({ value: "對", locale: "zh" })).toBe(true);
        expect(parseBoolean({ value: "否", locale: "zh" })).toBe(false);
        expect(parseBoolean({ value: "不是", locale: "zh" })).toBe(false);
    });

    it("folds Turkish I when the locale is Turkish", () => {
        expect(parseBoolean({ value: "evet", locale: "tr" })).toBe(true);
        expect(parseBoolean({ value: "hayır", locale: "tr" })).toBe(false);
        expect(parseBoolean({ value: "hayir", locale: "tr" })).toBe(false);
        expect(parseBoolean({ value: "HAYIR", locale: "tr" })).toBe(false);
        expect(parseBoolean({ value: "HAYIR", locale: "en" })).toBeUndefined();
    });

    it("keeps English tokens when the language is unknown", () => {
        expect(parseBoolean({ value: "oui", locale: "xx" })).toBeUndefined();
        expect(parseBoolean({ value: "yes", locale: "xx" })).toBe(true);
        expect(parseBoolean({ value: "yes", locale: "" })).toBe(true);
        expect(parseBoolean({ value: "maybe", locale: "" })).toBeUndefined();
        expect(parseBoolean({ value: "oui", locale: "fr_FR" })).toBeUndefined();
        expect(parseBoolean({ value: "yes", locale: "en_US" })).toBe(true);
    });

    it("reads Norwegian Bokmål from the no tag", () => {
        expect(parseBoolean({ value: "ja", locale: "no" })).toBe(true);
        expect(parseBoolean({ value: "nei", locale: "no-NO" })).toBe(false);
        expect(parseBoolean({ value: "nei", locale: "nb" })).toBe(false);
    });
});

describe("lenient", () => {
    it("accepts one keyboard typo of yes or no", () => {
        expect(parseBoolean({ value: "yss", lenient: true })).toBe(true);
        expect(parseBoolean({ value: "YSS", lenient: true })).toBe(true);
        expect(parseBoolean({ value: "mo", lenient: true })).toBe(false);
        expect(
            parseBoolean({
                value: "yes",
                lenient: true,
                wordListMode: "replace",
            }),
        ).toBe(true);
    });

    it("rejects typos that are not a single neighboring edit of yes or no", () => {
        expect(parseBoolean({ value: "yss", lenient: false })).toBeUndefined();
        expect(parseBoolean({ value: "tue", lenient: true })).toBeUndefined();
        expect(parseBoolean({ value: "maybe", lenient: true })).toBeUndefined();
        expect(parseBoolean({ value: "yep", lenient: true })).toBeUndefined();
        expect(parseBoolean({ value: "yeah", lenient: true })).toBeUndefined();
        expect(parseBoolean({ value: "yess", lenient: true })).toBeUndefined();
        expect(parseBoolean({ value: "ye", lenient: true })).toBeUndefined();
        expect(parseBoolean({ value: "yse", lenient: true })).toBeUndefined();
        expect(parseBoolean({ value: "yres", lenient: true })).toBeUndefined();
        expect(parseBoolean({ value: "sey", lenient: true })).toBeUndefined();
        expect(parseBoolean({ value: "yx", lenient: true })).toBeUndefined();
        expect(parseBoolean({ value: "abc", lenient: true })).toBeUndefined();
        expect(parseBoolean({ value: "yqes", lenient: true })).toBeUndefined();
        expect(parseBoolean({ value: "y3s", lenient: true })).toBeUndefined();
        expect(
            parseBoolean({ value: "YSS", lenient: true, caseSensitive: true }),
        ).toBeUndefined();
        expect(
            parseBoolean({ value: "ouu", locale: "fr", lenient: true }),
        ).toBeUndefined();
        expect(parseBoolean({ value: "on", lenient: true })).toBe(true);
    });
});

describe("round trip", () => {
    it("parses every formatted style back to the same boolean", () => {
        const styles = [
            "true-false",
            "yes-no",
            "on-off",
            "enabled-disabled",
            "y-n",
            "t-f",
            "1-0",
        ] as const;
        fc.assert(
            fc.property(
                fc.boolean(),
                fc.constantFrom(...styles),
                (value, style) => {
                    const formatted = formatBoolean({ value, style });
                    return parseBoolean(formatted) === value;
                },
            ),
        );
    });

    it("parses every locale yes/no word back when the same locale is set", () => {
        for (const locale of listBooleanLocales()) {
            fc.assert(
                fc.property(fc.boolean(), (value) => {
                    const formatted = formatBoolean({
                        value,
                        style: "yes-no",
                        locale,
                    });
                    return parseBoolean({ value: formatted, locale }) === value;
                }),
            );
        }
    });
});
