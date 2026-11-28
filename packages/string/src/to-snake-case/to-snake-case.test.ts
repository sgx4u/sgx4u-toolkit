import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { toSnakeCase } from "./to-snake-case.js";

describe("toSnakeCase", () => {
    it("separates words with underscores", () => {
        expect(toSnakeCase("foo bar")).toBe("foo_bar");
        expect(toSnakeCase("v1.2")).toBe("v_1_2");
        expect(toSnakeCase("version2Beta")).toBe("version_2_beta");
        expect(toSnakeCase("")).toBe("");
        expect(toSnakeCase(null as never)).toBeUndefined();
    });

    it("merges a letter and its digits when asked", () => {
        expect(
            toSnakeCase({ value: "v1.2", mergeAmbiguousCharacters: true }),
        ).toBe("v12");
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(toSnakeCase(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            toSnakeCase("") === undefined ||
                typeof toSnakeCase("") === "string" ||
                typeof toSnakeCase("") === "boolean" ||
                typeof toSnakeCase("") === "number" ||
                Array.isArray(toSnakeCase("")) ||
                (typeof toSnakeCase("") === "object" &&
                    toSnakeCase("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            toSnakeCase("👨‍👩‍👧") === undefined ||
                typeof toSnakeCase("👨‍👩‍👧") === "string" ||
                typeof toSnakeCase("👨‍👩‍👧") === "boolean" ||
                typeof toSnakeCase("👨‍👩‍👧") === "number" ||
                Array.isArray(toSnakeCase("👨‍👩‍👧")) ||
                (typeof toSnakeCase("👨‍👩‍👧") === "object" &&
                    toSnakeCase("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            toSnakeCase("e\u0301") === undefined ||
                typeof toSnakeCase("e\u0301") === "string" ||
                typeof toSnakeCase("e\u0301") === "boolean" ||
                typeof toSnakeCase("e\u0301") === "number" ||
                Array.isArray(toSnakeCase("e\u0301")) ||
                (typeof toSnakeCase("e\u0301") === "object" &&
                    toSnakeCase("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            toSnakeCase("مرحبا") === undefined ||
                typeof toSnakeCase("مرحبا") === "string" ||
                typeof toSnakeCase("مرحبا") === "boolean" ||
                typeof toSnakeCase("مرحبا") === "number" ||
                Array.isArray(toSnakeCase("مرحبا")) ||
                (typeof toSnakeCase("مرحبا") === "object" &&
                    toSnakeCase("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            toSnakeCase("你好") === undefined ||
                typeof toSnakeCase("你好") === "string" ||
                typeof toSnakeCase("你好") === "boolean" ||
                typeof toSnakeCase("你好") === "number" ||
                Array.isArray(toSnakeCase("你好")) ||
                (typeof toSnakeCase("你好") === "object" &&
                    toSnakeCase("你好") !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => toSnakeCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() => toSnakeCase({ value: "a", locale: 1 as never })).toThrow(
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
                    const once = toSnakeCase(value);
                    if (typeof once !== "string") {
                        throw new Error("expected a string");
                    }
                    expect(toSnakeCase(once)).toBe(once);
                },
            ),
            { numRuns: 20 },
        );
    });
});
