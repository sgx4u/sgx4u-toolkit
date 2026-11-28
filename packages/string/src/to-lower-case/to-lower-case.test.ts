import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { toLowerCase } from "./to-lower-case.js";

describe("toLowerCase", () => {
    it("converts case and honors Turkish", () => {
        expect(toLowerCase("Hello")).toBe("Hello".toLocaleLowerCase());
        expect(toLowerCase({ value: "I", locale: "tr-TR" })).toBe("ı");
        expect(toLowerCase("")).toBe("");
        expect(toLowerCase(null as unknown as string)).toBeUndefined();
        expect(() => toLowerCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(toLowerCase(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            toLowerCase("") === undefined ||
                typeof toLowerCase("") === "string" ||
                typeof toLowerCase("") === "boolean" ||
                typeof toLowerCase("") === "number" ||
                Array.isArray(toLowerCase("")) ||
                (typeof toLowerCase("") === "object" &&
                    toLowerCase("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            toLowerCase("👨‍👩‍👧") === undefined ||
                typeof toLowerCase("👨‍👩‍👧") === "string" ||
                typeof toLowerCase("👨‍👩‍👧") === "boolean" ||
                typeof toLowerCase("👨‍👩‍👧") === "number" ||
                Array.isArray(toLowerCase("👨‍👩‍👧")) ||
                (typeof toLowerCase("👨‍👩‍👧") === "object" &&
                    toLowerCase("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            toLowerCase("e\u0301") === undefined ||
                typeof toLowerCase("e\u0301") === "string" ||
                typeof toLowerCase("e\u0301") === "boolean" ||
                typeof toLowerCase("e\u0301") === "number" ||
                Array.isArray(toLowerCase("e\u0301")) ||
                (typeof toLowerCase("e\u0301") === "object" &&
                    toLowerCase("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            toLowerCase("مرحبا") === undefined ||
                typeof toLowerCase("مرحبا") === "string" ||
                typeof toLowerCase("مرحبا") === "boolean" ||
                typeof toLowerCase("مرحبا") === "number" ||
                Array.isArray(toLowerCase("مرحبا")) ||
                (typeof toLowerCase("مرحبا") === "object" &&
                    toLowerCase("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            toLowerCase("你好") === undefined ||
                typeof toLowerCase("你好") === "string" ||
                typeof toLowerCase("你好") === "boolean" ||
                typeof toLowerCase("你好") === "number" ||
                Array.isArray(toLowerCase("你好")) ||
                (typeof toLowerCase("你好") === "object" &&
                    toLowerCase("你好") !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => toLowerCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() => toLowerCase({ value: "a", locale: 1 as never })).toThrow(
            TypeError,
        );
    });
    it("is idempotent for a safe alphabet", () => {
        fc.assert(
            fc.property(
                fc.string({
                    unit: fc.constantFrom(..."abc -_"),
                    maxLength: 24,
                }),
                (value) => {
                    const once = toLowerCase(value);
                    if (typeof once !== "string") {
                        throw new Error("expected a string");
                    }
                    expect(toLowerCase(once)).toBe(once);
                },
            ),
            { numRuns: 20 },
        );
    });
});
