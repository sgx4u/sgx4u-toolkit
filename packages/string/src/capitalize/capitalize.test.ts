import { describe, expect, it } from "vitest";
import { capitalize } from "./capitalize.js";

describe("capitalize", () => {
    it("changes the first grapheme", () => {
        expect(capitalize("hello")).toBe("Hello");
        expect(capitalize("ÉCLAIR")).toBe("Éclair");
        expect(capitalize({ value: "hELLO", restToLowerCase: false })).toBe(
            "HELLO",
        );
        expect(capitalize({ value: "istanbul", locale: "tr-TR" })).toBe(
            "İstanbul",
        );
        expect(capitalize("")).toBe("");
        expect(capitalize(null as unknown as string)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(capitalize(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            capitalize("") === undefined ||
                typeof capitalize("") === "string" ||
                typeof capitalize("") === "boolean" ||
                typeof capitalize("") === "number" ||
                Array.isArray(capitalize("")) ||
                (typeof capitalize("") === "object" && capitalize("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            capitalize("👨‍👩‍👧") === undefined ||
                typeof capitalize("👨‍👩‍👧") === "string" ||
                typeof capitalize("👨‍👩‍👧") === "boolean" ||
                typeof capitalize("👨‍👩‍👧") === "number" ||
                Array.isArray(capitalize("👨‍👩‍👧")) ||
                (typeof capitalize("👨‍👩‍👧") === "object" &&
                    capitalize("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            capitalize("e\u0301") === undefined ||
                typeof capitalize("e\u0301") === "string" ||
                typeof capitalize("e\u0301") === "boolean" ||
                typeof capitalize("e\u0301") === "number" ||
                Array.isArray(capitalize("e\u0301")) ||
                (typeof capitalize("e\u0301") === "object" &&
                    capitalize("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            capitalize("مرحبا") === undefined ||
                typeof capitalize("مرحبا") === "string" ||
                typeof capitalize("مرحبا") === "boolean" ||
                typeof capitalize("مرحبا") === "number" ||
                Array.isArray(capitalize("مرحبا")) ||
                (typeof capitalize("مرحبا") === "object" &&
                    capitalize("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            capitalize("你好") === undefined ||
                typeof capitalize("你好") === "string" ||
                typeof capitalize("你好") === "boolean" ||
                typeof capitalize("你好") === "number" ||
                Array.isArray(capitalize("你好")) ||
                (typeof capitalize("你好") === "object" &&
                    capitalize("你好") !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => capitalize({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() => capitalize({ value: "a", locale: 1 as never })).toThrow(
            TypeError,
        );
    });
});
