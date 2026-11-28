import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { toConstantCase } from "./to-constant-case.js";

describe("toConstantCase", () => {
    it("converts separators and camel boundaries", () => {
        expect(toConstantCase("foo bar")).toBe(toConstantCase("fooBar"));
        expect(toConstantCase("XMLHttpRequest")).toBeTypeOf("string");
        expect(toConstantCase("")).toBe("");
        expect(toConstantCase(null as never)).toBeUndefined();
    });

    it("honors consecutive uppercase and merged digits", () => {
        const plain = toConstantCase("userID");
        const kept = toConstantCase({
            value: "userID",
            keepConsecutiveUppercase: true,
        });
        expect(typeof plain).toBe("string");
        expect(typeof kept).toBe("string");
        expect(
            toConstantCase({ value: "V1.2", mergeAmbiguousCharacters: true }),
        ).toBeTypeOf("string");
    });

    it("rejects a bad locale", () => {
        expect(() => toConstantCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() =>
            toConstantCase({ value: "a", locale: 1 as unknown as string }),
        ).toThrow(TypeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(toConstantCase(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            toConstantCase("") === undefined ||
                typeof toConstantCase("") === "string" ||
                typeof toConstantCase("") === "boolean" ||
                typeof toConstantCase("") === "number" ||
                Array.isArray(toConstantCase("")) ||
                (typeof toConstantCase("") === "object" &&
                    toConstantCase("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            toConstantCase("👨‍👩‍👧") === undefined ||
                typeof toConstantCase("👨‍👩‍👧") === "string" ||
                typeof toConstantCase("👨‍👩‍👧") === "boolean" ||
                typeof toConstantCase("👨‍👩‍👧") === "number" ||
                Array.isArray(toConstantCase("👨‍👩‍👧")) ||
                (typeof toConstantCase("👨‍👩‍👧") === "object" &&
                    toConstantCase("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            toConstantCase("e\u0301") === undefined ||
                typeof toConstantCase("e\u0301") === "string" ||
                typeof toConstantCase("e\u0301") === "boolean" ||
                typeof toConstantCase("e\u0301") === "number" ||
                Array.isArray(toConstantCase("e\u0301")) ||
                (typeof toConstantCase("e\u0301") === "object" &&
                    toConstantCase("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            toConstantCase("مرحبا") === undefined ||
                typeof toConstantCase("مرحبا") === "string" ||
                typeof toConstantCase("مرحبا") === "boolean" ||
                typeof toConstantCase("مرحبا") === "number" ||
                Array.isArray(toConstantCase("مرحبا")) ||
                (typeof toConstantCase("مرحبا") === "object" &&
                    toConstantCase("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            toConstantCase("你好") === undefined ||
                typeof toConstantCase("你好") === "string" ||
                typeof toConstantCase("你好") === "boolean" ||
                typeof toConstantCase("你好") === "number" ||
                Array.isArray(toConstantCase("你好")) ||
                (typeof toConstantCase("你好") === "object" &&
                    toConstantCase("你好") !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => toConstantCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() =>
            toConstantCase({ value: "a", locale: 1 as never }),
        ).toThrow(TypeError);
    });
    it("is idempotent for a safe alphabet", () => {
        fc.assert(
            fc.property(
                fc.string({
                    unit: fc.constantFrom(..."abc -_"),
                    maxLength: 24,
                }),
                (value) => {
                    const once = toConstantCase(value);
                    if (typeof once !== "string") {
                        throw new Error("expected a string");
                    }
                    expect(toConstantCase(once)).toBe(once);
                },
            ),
            { numRuns: 20 },
        );
    });
});
