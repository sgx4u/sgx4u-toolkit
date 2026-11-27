import fc from "fast-check";
import { describe, expect, expectTypeOf, it } from "vitest";
import {
    all,
    createBoolean,
    formatBoolean,
    isBoolean,
    parseBoolean,
} from "../index.js";

describe("defaults", () => {
    it("uses the package defaults when config is omitted", () => {
        const booleans = createBoolean();
        expect(booleans.parseBoolean(" YES ")).toBe(true);
        expect(booleans.parseBoolean("maybe")).toBeUndefined();
        expect(booleans.parseBoolean("oui")).toBeUndefined();
        expect(booleans.formatBoolean({ value: true })).toBe("true");
        expect(booleans.getBooleanWords().truthy).toContain("enabled");
        expect(booleans.isBoolean(false)).toBe(true);
        expect(booleans.all([])).toBe(true);
        expect(booleans.listBooleanLocales()).toContain("en");
        expect("createBoolean" in booleans).toBe(false);
        expectTypeOf(booleans.parseBoolean("yes")).toEqualTypeOf<
            boolean | undefined
        >();
    });

    it("binds locale, words, fallback, and format defaults", () => {
        const booleans = createBoolean({
            locale: "fr",
            truthyWords: ["custom"],
            fallback: false,
            formatStyle: "yes-no",
            formatCapitalization: "sentence",
        });
        expect(booleans.parseBoolean("oui")).toBe(true);
        expect(booleans.parseBoolean("custom")).toBe(true);
        expect(booleans.parseBoolean("maybe")).toBe(false);
        expect(booleans.isParseableBoolean("maybe")).toBe(false);
        expect(booleans.formatBoolean({ value: true })).toBe("Oui");
        expect(
            booleans.formatBoolean({ value: true, style: "true-false" }),
        ).toBe("True");
        expect(
            booleans.formatBoolean({
                value: true,
                style: "true-false",
                capitalization: "lower",
            }),
        ).toBe("true");
        expect(
            booleans.formatBoolean({
                value: true,
                style: undefined,
            } as unknown as Parameters<typeof booleans.formatBoolean>[0]),
        ).toBe("Oui");
        expect(booleans.getBooleanWords().truthy.at(-1)).toBe("oui");
        expect(booleans.getBooleanWords({ locale: "de" }).truthy.at(-1)).toBe(
            "ja",
        );
        expectTypeOf(booleans.parseBoolean("yes")).toEqualTypeOf<boolean>();
        expectTypeOf(
            booleans.parseBoolean({ value: "maybe", fallback: true }),
        ).toEqualTypeOf<boolean>();
    });
});

describe("overrides", () => {
    it("lets one call replace a stored option", () => {
        const booleans = createBoolean({
            truthyWords: ["custom"],
            fallback: false,
            lenient: false,
        });
        expect(
            booleans.parseBoolean({ value: "custom", truthyWords: ["other"] }),
        ).toBe(false);
        expect(
            booleans.parseBoolean({ value: "other", truthyWords: ["other"] }),
        ).toBe(true);
        expect(booleans.parseBoolean("custom")).toBe(true);
        expect(booleans.parseBoolean({ value: "maybe", fallback: true })).toBe(
            true,
        );
        expect(
            booleans.parseBoolean({ value: "yes", wordListMode: "replace" }),
        ).toBe(false);
        expect(
            booleans.parseBoolean({
                value: "custom",
                wordListMode: "replace",
            }),
        ).toBe(true);
        expect(booleans.parseBoolean({ value: "yss", lenient: true })).toBe(
            true,
        );
    });
});

describe("isolation", () => {
    it("keeps two instances and the root function independent", () => {
        const hindi = createBoolean({
            locale: "hi",
            truthyWords: ["haan"],
        });
        const french = createBoolean({ locale: "fr", fallback: true });
        expect(hindi.parseBoolean("हाँ")).toBe(true);
        expect(french.parseBoolean("हाँ")).toBe(true);
        expect(hindi.isParseableBoolean("हाँ")).toBe(true);
        expect(french.isParseableBoolean("हाँ")).toBe(false);
        expect(french.parseBoolean("oui")).toBe(true);
        expect(hindi.parseBoolean("oui")).toBeUndefined();
        expect(parseBoolean("हाँ")).toBeUndefined();
        expect(parseBoolean("oui")).toBeUndefined();
        expect(parseBoolean("haan")).toBeUndefined();
        expect(parseBoolean("maybe")).toBeUndefined();
        expect(formatBoolean({ value: true })).toBe("true");
        expect(hindi.formatBoolean({ value: true, style: "yes-no" })).toBe(
            "हाँ",
        );
        expect(french.formatBoolean({ value: true, style: "yes-no" })).toBe(
            "oui",
        );
    });

    it("copies config arrays so later mutation does not leak", () => {
        const words = ["alpha"];
        const config: {
            truthyWords: string[];
            wordListMode: "extend" | "replace";
        } = { truthyWords: words, wordListMode: "replace" };
        const instance = createBoolean(config);
        words.push("beta");
        words[0] = "gamma";
        config.wordListMode = "extend";
        expect(instance.parseBoolean("alpha")).toBe(true);
        expect(instance.parseBoolean("beta")).toBeUndefined();
        expect(instance.parseBoolean("gamma")).toBeUndefined();
        expect(instance.parseBoolean("yes")).toBeUndefined();
        expect(parseBoolean("alpha")).toBeUndefined();
    });

    it("is unchanged when another instance is created", () => {
        fc.assert(
            fc.property(
                fc.string().filter((word) => word.trim().length > 0),
                (word) => {
                    const before = parseBoolean(word);
                    const instance = createBoolean({
                        truthyWords: [word],
                        wordListMode: "replace",
                    });
                    createBoolean({
                        locale: "ja",
                        truthyWords: [`other-${word}`],
                    });
                    return (
                        instance.parseBoolean(word) === true &&
                        parseBoolean(word) === before
                    );
                },
            ),
        );
    });
});

describe("validation", () => {
    it("throws at creation for a bad option or an overlap", () => {
        expect(() => createBoolean({ truthyWords: ["no"] })).toThrow(
            RangeError,
        );
        expect(() => createBoolean({ lenient: "yes" as never })).toThrow(
            TypeError,
        );
        expect(() => createBoolean({ formatStyle: "nope" as never })).toThrow(
            /style/,
        );
        expect(() =>
            createBoolean({ formatCapitalization: "title" as never }),
        ).toThrow(/capitalization/);
        expect(() => createBoolean(null as never)).toThrow(
            /config must be an object/,
        );
        expect(() => createBoolean([] as never)).toThrow(TypeError);
        expect(() => createBoolean("fr" as never)).toThrow(TypeError);
        expect(parseBoolean("yes")).toBe(true);
        expect(isBoolean(true)).toBe(true);
        expect(all([true])).toBe(true);
    });

    it("rejects a non-object passed to a configured method", () => {
        const booleans = createBoolean({ locale: "fr" });
        expect(() => booleans.formatBoolean(true as never)).toThrow(TypeError);
        expect(() => booleans.getBooleanWords("fr" as never)).toThrow(
            TypeError,
        );
    });
});
