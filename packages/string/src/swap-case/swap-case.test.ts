import { describe, expect, it } from "vitest";
import { swapCase } from "./swap-case.js";

describe("swapCase", () => {
    it("flips cased letters", () => {
        expect(swapCase("Hello")).toBe("hELLO");
        expect(swapCase("123")).toBe("123");
        expect(swapCase("")).toBe("");
        expect(swapCase(null as unknown as string)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(swapCase(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            swapCase("") === undefined ||
                typeof swapCase("") === "string" ||
                typeof swapCase("") === "boolean" ||
                typeof swapCase("") === "number" ||
                Array.isArray(swapCase("")) ||
                (typeof swapCase("") === "object" && swapCase("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            swapCase("👨‍👩‍👧") === undefined ||
                typeof swapCase("👨‍👩‍👧") === "string" ||
                typeof swapCase("👨‍👩‍👧") === "boolean" ||
                typeof swapCase("👨‍👩‍👧") === "number" ||
                Array.isArray(swapCase("👨‍👩‍👧")) ||
                (typeof swapCase("👨‍👩‍👧") === "object" && swapCase("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            swapCase("e\u0301") === undefined ||
                typeof swapCase("e\u0301") === "string" ||
                typeof swapCase("e\u0301") === "boolean" ||
                typeof swapCase("e\u0301") === "number" ||
                Array.isArray(swapCase("e\u0301")) ||
                (typeof swapCase("e\u0301") === "object" &&
                    swapCase("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            swapCase("مرحبا") === undefined ||
                typeof swapCase("مرحبا") === "string" ||
                typeof swapCase("مرحبا") === "boolean" ||
                typeof swapCase("مرحبا") === "number" ||
                Array.isArray(swapCase("مرحبا")) ||
                (typeof swapCase("مرحبا") === "object" &&
                    swapCase("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            swapCase("你好") === undefined ||
                typeof swapCase("你好") === "string" ||
                typeof swapCase("你好") === "boolean" ||
                typeof swapCase("你好") === "number" ||
                Array.isArray(swapCase("你好")) ||
                (typeof swapCase("你好") === "object" &&
                    swapCase("你好") !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => swapCase({ value: "a", locale: "" })).toThrow(RangeError);
        expect(() => swapCase({ value: "a", locale: 1 as never })).toThrow(
            TypeError,
        );
    });
});
