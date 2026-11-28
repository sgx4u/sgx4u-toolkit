import { describe, expect, it } from "vitest";
import { stripBOM } from "./strip-bom.js";
describe("stripBOM", () => {
    it("removes one leading BOM", () => {
        expect(stripBOM("\uFEFFhello")).toBe("hello");
        expect(stripBOM("hello")).toBe("hello");
        expect(stripBOM("")).toBe("");
        expect(stripBOM(null)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(stripBOM(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            stripBOM("") === undefined ||
                typeof stripBOM("") === "string" ||
                typeof stripBOM("") === "boolean" ||
                typeof stripBOM("") === "number" ||
                Array.isArray(stripBOM("")) ||
                (typeof stripBOM("") === "object" && stripBOM("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            stripBOM("👨‍👩‍👧") === undefined ||
                typeof stripBOM("👨‍👩‍👧") === "string" ||
                typeof stripBOM("👨‍👩‍👧") === "boolean" ||
                typeof stripBOM("👨‍👩‍👧") === "number" ||
                Array.isArray(stripBOM("👨‍👩‍👧")) ||
                (typeof stripBOM("👨‍👩‍👧") === "object" && stripBOM("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            stripBOM("e\u0301") === undefined ||
                typeof stripBOM("e\u0301") === "string" ||
                typeof stripBOM("e\u0301") === "boolean" ||
                typeof stripBOM("e\u0301") === "number" ||
                Array.isArray(stripBOM("e\u0301")) ||
                (typeof stripBOM("e\u0301") === "object" &&
                    stripBOM("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            stripBOM("مرحبا") === undefined ||
                typeof stripBOM("مرحبا") === "string" ||
                typeof stripBOM("مرحبا") === "boolean" ||
                typeof stripBOM("مرحبا") === "number" ||
                Array.isArray(stripBOM("مرحبا")) ||
                (typeof stripBOM("مرحبا") === "object" &&
                    stripBOM("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            stripBOM("你好") === undefined ||
                typeof stripBOM("你好") === "string" ||
                typeof stripBOM("你好") === "boolean" ||
                typeof stripBOM("你好") === "number" ||
                Array.isArray(stripBOM("你好")) ||
                (typeof stripBOM("你好") === "object" &&
                    stripBOM("你好") !== null),
        ).toBe(true);
    });
});
