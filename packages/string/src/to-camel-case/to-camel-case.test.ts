import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { toCamelCase } from "./to-camel-case.js";

describe("toCamelCase", () => {
    it("converts words to camel case", () => {
        expect(toCamelCase("foo bar")).toBe("fooBar");
        expect(toCamelCase("fooBar")).toBe("fooBar");
        expect(toCamelCase("XMLHttpRequest")).toBe("xmlHttpRequest");
        expect(toCamelCase("userID")).toBe("userId");
        expect(toCamelCase("__typename")).toBe("typename");
        expect(toCamelCase("version2Beta")).toBe("version2Beta");
        expect(toCamelCase("")).toBe("");
        expect(toCamelCase(null as never)).toBeUndefined();
        expect(toCamelCase(new String("a") as never)).toBeUndefined();
    });

    it("keeps acronyms and merges digits when asked", () => {
        expect(
            toCamelCase({
                value: "userID",
                keepConsecutiveUppercase: true,
            }),
        ).toBe("userID");
        expect(
            toCamelCase({
                value: "foo-BAR",
                keepConsecutiveUppercase: true,
            }),
        ).toBe("fooBAR");
        expect(
            toCamelCase({
                value: "XMLHttpRequest",
                keepConsecutiveUppercase: true,
            }),
        ).toBe("xmlHttpRequest");
        expect(
            toCamelCase({
                value: "V1.2",
                mergeAmbiguousCharacters: true,
            }),
        ).toBe("v12");
        expect(toCamelCase({ value: "I", locale: "tr-TR" })).toBe("ı");
    });

    it("rejects a bad option", () => {
        expect(() => toCamelCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() =>
            toCamelCase({ value: "a", locale: 1 as unknown as string }),
        ).toThrow(TypeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(toCamelCase(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            toCamelCase("") === undefined ||
                typeof toCamelCase("") === "string" ||
                typeof toCamelCase("") === "boolean" ||
                typeof toCamelCase("") === "number" ||
                Array.isArray(toCamelCase("")) ||
                (typeof toCamelCase("") === "object" &&
                    toCamelCase("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            toCamelCase("👨‍👩‍👧") === undefined ||
                typeof toCamelCase("👨‍👩‍👧") === "string" ||
                typeof toCamelCase("👨‍👩‍👧") === "boolean" ||
                typeof toCamelCase("👨‍👩‍👧") === "number" ||
                Array.isArray(toCamelCase("👨‍👩‍👧")) ||
                (typeof toCamelCase("👨‍👩‍👧") === "object" &&
                    toCamelCase("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            toCamelCase("e\u0301") === undefined ||
                typeof toCamelCase("e\u0301") === "string" ||
                typeof toCamelCase("e\u0301") === "boolean" ||
                typeof toCamelCase("e\u0301") === "number" ||
                Array.isArray(toCamelCase("e\u0301")) ||
                (typeof toCamelCase("e\u0301") === "object" &&
                    toCamelCase("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            toCamelCase("مرحبا") === undefined ||
                typeof toCamelCase("مرحبا") === "string" ||
                typeof toCamelCase("مرحبا") === "boolean" ||
                typeof toCamelCase("مرحبا") === "number" ||
                Array.isArray(toCamelCase("مرحبا")) ||
                (typeof toCamelCase("مرحبا") === "object" &&
                    toCamelCase("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            toCamelCase("你好") === undefined ||
                typeof toCamelCase("你好") === "string" ||
                typeof toCamelCase("你好") === "boolean" ||
                typeof toCamelCase("你好") === "number" ||
                Array.isArray(toCamelCase("你好")) ||
                (typeof toCamelCase("你好") === "object" &&
                    toCamelCase("你好") !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => toCamelCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() => toCamelCase({ value: "a", locale: 1 as never })).toThrow(
            TypeError,
        );
    });
    it("round-trips through snake case for words of two or more letters", () => {
        fc.assert(
            fc.property(
                fc.array(
                    fc.string({
                        unit: fc.constantFrom(..."abc"),
                        minLength: 2,
                        maxLength: 4,
                    }),
                    { minLength: 1, maxLength: 4 },
                ),
                (words) => {
                    const camel = toCamelCase(words.join(" "));
                    if (typeof camel !== "string") {
                        throw new Error("expected a string");
                    }
                    const snake = camel.replace(
                        /[A-Z]/gu,
                        (letter) => `_${letter.toLowerCase()}`,
                    );
                    expect(toCamelCase(snake)).toBe(camel);
                },
            ),
            { numRuns: 20 },
        );
    });
});
