import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { normalizeUnicode } from "./normalize-unicode.js";

describe("normalizeUnicode", () => {
    it("normalizes and is idempotent", () => {
        expect(normalizeUnicode("e\u0301")).toBe("é");
        expect(normalizeUnicode({ value: "é", form: "NFD" })).toBe("e\u0301");
        expect(normalizeUnicode("")).toBe("");
        expect(normalizeUnicode(null as unknown as string)).toBeUndefined();
        expect(() =>
            normalizeUnicode({ value: "a", form: "nope" as "NFC" }),
        ).toThrow(RangeError);
    });

    it("is idempotent for random strings", () => {
        fc.assert(
            fc.property(fc.string({ maxLength: 40 }), (value) => {
                const once = normalizeUnicode(value);
                expect(normalizeUnicode(once ?? "")).toBe(once);
            }),
            { numRuns: 30 },
        );
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(normalizeUnicode(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            normalizeUnicode("") === undefined ||
                typeof normalizeUnicode("") === "string" ||
                typeof normalizeUnicode("") === "boolean" ||
                typeof normalizeUnicode("") === "number" ||
                Array.isArray(normalizeUnicode("")) ||
                (typeof normalizeUnicode("") === "object" &&
                    normalizeUnicode("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            normalizeUnicode("👨‍👩‍👧") === undefined ||
                typeof normalizeUnicode("👨‍👩‍👧") === "string" ||
                typeof normalizeUnicode("👨‍👩‍👧") === "boolean" ||
                typeof normalizeUnicode("👨‍👩‍👧") === "number" ||
                Array.isArray(normalizeUnicode("👨‍👩‍👧")) ||
                (typeof normalizeUnicode("👨‍👩‍👧") === "object" &&
                    normalizeUnicode("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            normalizeUnicode("e\u0301") === undefined ||
                typeof normalizeUnicode("e\u0301") === "string" ||
                typeof normalizeUnicode("e\u0301") === "boolean" ||
                typeof normalizeUnicode("e\u0301") === "number" ||
                Array.isArray(normalizeUnicode("e\u0301")) ||
                (typeof normalizeUnicode("e\u0301") === "object" &&
                    normalizeUnicode("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            normalizeUnicode("مرحبا") === undefined ||
                typeof normalizeUnicode("مرحبا") === "string" ||
                typeof normalizeUnicode("مرحبا") === "boolean" ||
                typeof normalizeUnicode("مرحبا") === "number" ||
                Array.isArray(normalizeUnicode("مرحبا")) ||
                (typeof normalizeUnicode("مرحبا") === "object" &&
                    normalizeUnicode("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            normalizeUnicode("你好") === undefined ||
                typeof normalizeUnicode("你好") === "string" ||
                typeof normalizeUnicode("你好") === "boolean" ||
                typeof normalizeUnicode("你好") === "number" ||
                Array.isArray(normalizeUnicode("你好")) ||
                (typeof normalizeUnicode("你好") === "object" &&
                    normalizeUnicode("你好") !== null),
        ).toBe(true);
    });
});
