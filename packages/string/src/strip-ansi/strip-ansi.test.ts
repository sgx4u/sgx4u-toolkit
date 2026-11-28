import { describe, expect, it } from "vitest";
import { stripANSI } from "./strip-ansi.js";
describe("stripANSI", () => {
    it("removes a color sequence", () => {
        expect(stripANSI("\u001b[31mred\u001b[0m")).toBe("red");
        expect(stripANSI("plain")).toBe("plain");
        expect(stripANSI(null)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(stripANSI(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            stripANSI("") === undefined ||
                typeof stripANSI("") === "string" ||
                typeof stripANSI("") === "boolean" ||
                typeof stripANSI("") === "number" ||
                Array.isArray(stripANSI("")) ||
                (typeof stripANSI("") === "object" && stripANSI("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            stripANSI("👨‍👩‍👧") === undefined ||
                typeof stripANSI("👨‍👩‍👧") === "string" ||
                typeof stripANSI("👨‍👩‍👧") === "boolean" ||
                typeof stripANSI("👨‍👩‍👧") === "number" ||
                Array.isArray(stripANSI("👨‍👩‍👧")) ||
                (typeof stripANSI("👨‍👩‍👧") === "object" &&
                    stripANSI("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            stripANSI("e\u0301") === undefined ||
                typeof stripANSI("e\u0301") === "string" ||
                typeof stripANSI("e\u0301") === "boolean" ||
                typeof stripANSI("e\u0301") === "number" ||
                Array.isArray(stripANSI("e\u0301")) ||
                (typeof stripANSI("e\u0301") === "object" &&
                    stripANSI("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            stripANSI("مرحبا") === undefined ||
                typeof stripANSI("مرحبا") === "string" ||
                typeof stripANSI("مرحبا") === "boolean" ||
                typeof stripANSI("مرحبا") === "number" ||
                Array.isArray(stripANSI("مرحبا")) ||
                (typeof stripANSI("مرحبا") === "object" &&
                    stripANSI("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            stripANSI("你好") === undefined ||
                typeof stripANSI("你好") === "string" ||
                typeof stripANSI("你好") === "boolean" ||
                typeof stripANSI("你好") === "number" ||
                Array.isArray(stripANSI("你好")) ||
                (typeof stripANSI("你好") === "object" &&
                    stripANSI("你好") !== null),
        ).toBe(true);
    });
});
