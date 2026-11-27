import { describe, expect, it } from "vitest";
import { formatBoolean, parseBoolean } from "../index.js";

const styles = [
    "true-false",
    "yes-no",
    "on-off",
    "enabled-disabled",
    "y-n",
    "t-f",
    "1-0",
] as const;

const englishWords: Record<(typeof styles)[number], readonly [string, string]> =
    {
        "true-false": ["true", "false"],
        "yes-no": ["yes", "no"],
        "on-off": ["on", "off"],
        "enabled-disabled": ["enabled", "disabled"],
        "y-n": ["y", "n"],
        "t-f": ["t", "f"],
        "1-0": ["1", "0"],
    };

describe("styles", () => {
    it("defaults to true and false", () => {
        expect(formatBoolean({ value: true })).toBe("true");
        expect(formatBoolean({ value: false })).toBe("false");
    });

    it.each(styles)("emits the English %s pair", (style) => {
        const [truthyWord, falsyWord] = englishWords[style];
        expect(formatBoolean({ value: true, style })).toBe(truthyWord);
        expect(formatBoolean({ value: false, style })).toBe(falsyWord);
    });

    it("uses a known locale's primary word for yes-no and y-n", () => {
        expect(
            formatBoolean({ value: true, style: "yes-no", locale: "fr" }),
        ).toBe("oui");
        expect(
            formatBoolean({ value: false, style: "y-n", locale: "fr" }),
        ).toBe("non");
        expect(formatBoolean({ value: true, style: "y-n", locale: "ja" })).toBe(
            "はい",
        );
        expect(
            formatBoolean({ value: false, style: "yes-no", locale: "ja" }),
        ).toBe("いいえ");
        expect(
            formatBoolean({ value: true, style: "yes-no", locale: "zh-Hans" }),
        ).toBe("是");
        expect(
            formatBoolean({ value: false, style: "y-n", locale: "ar" }),
        ).toBe("لا");
        expect(
            formatBoolean({ value: true, style: "yes-no", locale: "en" }),
        ).toBe("yes");
        expect(
            formatBoolean({ value: true, style: "y-n", locale: "en-US" }),
        ).toBe("y");
        expect(
            formatBoolean({ value: true, style: "yes-no", locale: "xx" }),
        ).toBe("yes");
        expect(
            formatBoolean({ value: true, style: "on-off", locale: "fr" }),
        ).toBe("on");
    });
});

describe("capitalization", () => {
    it("uppercases the first character or the whole word with the locale", () => {
        expect(
            formatBoolean({
                value: true,
                style: "yes-no",
                capitalization: "sentence",
            }),
        ).toBe("Yes");
        expect(
            formatBoolean({
                value: false,
                style: "enabled-disabled",
                capitalization: "sentence",
            }),
        ).toBe("Disabled");
        expect(
            formatBoolean({
                value: true,
                style: "yes-no",
                locale: "es",
                capitalization: "sentence",
            }),
        ).toBe("Sí");
        expect(
            formatBoolean({
                value: true,
                style: "yes-no",
                locale: "es",
                capitalization: "upper",
            }),
        ).toBe("SÍ");
        expect(
            formatBoolean({
                value: true,
                style: "yes-no",
                locale: "fr",
                capitalization: "sentence",
            }),
        ).toBe("Oui");
        expect(
            formatBoolean({
                value: true,
                style: "yes-no",
                locale: "fr",
                capitalization: "upper",
            }),
        ).toBe("OUI");
        expect(
            formatBoolean({
                value: false,
                style: "enabled-disabled",
                locale: "tr",
                capitalization: "upper",
            }),
        ).toBe("DİSABLED");
        expect(
            formatBoolean({
                value: true,
                style: "1-0",
                capitalization: "upper",
                locale: "fr",
            }),
        ).toBe("1");
        expect(
            formatBoolean({
                value: false,
                style: "1-0",
                capitalization: "sentence",
            }),
        ).toBe("0");
    });
});

describe("invalid input", () => {
    it("returns undefined when value is not a primitive boolean", () => {
        expect(formatBoolean({ value: "true" })).toBeUndefined();
        expect(formatBoolean({ value: 1 })).toBeUndefined();
        expect(formatBoolean({ value: null })).toBeUndefined();
        expect(formatBoolean({ value: new Boolean(true) })).toBeUndefined();
        expect(formatBoolean({} as never)).toBeUndefined();
    });

    it("throws for a bad argument or a bad option", () => {
        expect(() => formatBoolean(true as never)).toThrow(TypeError);
        expect(() => formatBoolean(null as never)).toThrow(
            /requires an object/,
        );
        expect(() => formatBoolean([] as never)).toThrow(TypeError);
        expect(() =>
            formatBoolean({ value: true, style: "maybe" as never }),
        ).toThrow(/style/);
        expect(() =>
            formatBoolean({ value: true, capitalization: "title" as never }),
        ).toThrow(/capitalization/);
        expect(() =>
            formatBoolean({ value: true, locale: 1 as never }),
        ).toThrow(/locale/);
    });
});

it("round-trips locale y-n words through parseBoolean", () => {
    expect(
        parseBoolean({
            value: formatBoolean({ value: true, style: "y-n", locale: "de" }),
            locale: "de",
        }),
    ).toBe(true);
    expect(
        parseBoolean({
            value: formatBoolean({ value: false, style: "y-n", locale: "hi" }),
            locale: "hi",
        }),
    ).toBe(false);
});
