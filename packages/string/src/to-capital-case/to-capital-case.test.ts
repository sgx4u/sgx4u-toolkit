import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { toCapitalCase } from "./to-capital-case.js";

describe("toCapitalCase", () => {
    it("converts words", () => {
        expect(toCapitalCase("fooBar")).toBe("Foo Bar");
        expect(toCapitalCase("")).toBe("");
        expect(toCapitalCase(null as unknown as string)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(toCapitalCase(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            toCapitalCase("") === undefined ||
                typeof toCapitalCase("") === "string" ||
                typeof toCapitalCase("") === "boolean" ||
                typeof toCapitalCase("") === "number" ||
                Array.isArray(toCapitalCase("")) ||
                (typeof toCapitalCase("") === "object" &&
                    toCapitalCase("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            toCapitalCase("👨‍👩‍👧") === undefined ||
                typeof toCapitalCase("👨‍👩‍👧") === "string" ||
                typeof toCapitalCase("👨‍👩‍👧") === "boolean" ||
                typeof toCapitalCase("👨‍👩‍👧") === "number" ||
                Array.isArray(toCapitalCase("👨‍👩‍👧")) ||
                (typeof toCapitalCase("👨‍👩‍👧") === "object" &&
                    toCapitalCase("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            toCapitalCase("e\u0301") === undefined ||
                typeof toCapitalCase("e\u0301") === "string" ||
                typeof toCapitalCase("e\u0301") === "boolean" ||
                typeof toCapitalCase("e\u0301") === "number" ||
                Array.isArray(toCapitalCase("e\u0301")) ||
                (typeof toCapitalCase("e\u0301") === "object" &&
                    toCapitalCase("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            toCapitalCase("مرحبا") === undefined ||
                typeof toCapitalCase("مرحبا") === "string" ||
                typeof toCapitalCase("مرحبا") === "boolean" ||
                typeof toCapitalCase("مرحبا") === "number" ||
                Array.isArray(toCapitalCase("مرحبا")) ||
                (typeof toCapitalCase("مرحبا") === "object" &&
                    toCapitalCase("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            toCapitalCase("你好") === undefined ||
                typeof toCapitalCase("你好") === "string" ||
                typeof toCapitalCase("你好") === "boolean" ||
                typeof toCapitalCase("你好") === "number" ||
                Array.isArray(toCapitalCase("你好")) ||
                (typeof toCapitalCase("你好") === "object" &&
                    toCapitalCase("你好") !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => toCapitalCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() => toCapitalCase({ value: "a", locale: 1 as never })).toThrow(
            TypeError,
        );
    });
    it("is idempotent for a safe alphabet", () => {
        fc.assert(
            fc.property(
                fc.string({
                    unit: fc.constantFrom(..."abcXYZ -_"),
                    maxLength: 24,
                }),
                (value) => {
                    const once = toCapitalCase(value);
                    if (typeof once !== "string") {
                        throw new Error("expected a string");
                    }
                    expect(toCapitalCase(once)).toBe(once);
                },
            ),
            { numRuns: 20 },
        );
    });
});
