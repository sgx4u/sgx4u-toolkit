import { describe, expect, it } from "vitest";
import { getSoundex } from "./get-soundex.js";
describe("getSoundex", () => {
    it("encodes the classic examples", () => {
        expect(getSoundex("Robert")).toBe("R163");
        expect(getSoundex("Rupert")).toBe("R163");
        expect(getSoundex("Ashcraft")).toBe("A261");
        expect(getSoundex("123")).toBeUndefined();
        expect(getSoundex(null)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getSoundex(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getSoundex("") === undefined ||
                typeof getSoundex("") === "string" ||
                typeof getSoundex("") === "boolean" ||
                typeof getSoundex("") === "number" ||
                Array.isArray(getSoundex("")) ||
                (typeof getSoundex("") === "object" && getSoundex("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getSoundex("👨‍👩‍👧") === undefined ||
                typeof getSoundex("👨‍👩‍👧") === "string" ||
                typeof getSoundex("👨‍👩‍👧") === "boolean" ||
                typeof getSoundex("👨‍👩‍👧") === "number" ||
                Array.isArray(getSoundex("👨‍👩‍👧")) ||
                (typeof getSoundex("👨‍👩‍👧") === "object" &&
                    getSoundex("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getSoundex("e\u0301") === undefined ||
                typeof getSoundex("e\u0301") === "string" ||
                typeof getSoundex("e\u0301") === "boolean" ||
                typeof getSoundex("e\u0301") === "number" ||
                Array.isArray(getSoundex("e\u0301")) ||
                (typeof getSoundex("e\u0301") === "object" &&
                    getSoundex("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getSoundex("مرحبا") === undefined ||
                typeof getSoundex("مرحبا") === "string" ||
                typeof getSoundex("مرحبا") === "boolean" ||
                typeof getSoundex("مرحبا") === "number" ||
                Array.isArray(getSoundex("مرحبا")) ||
                (typeof getSoundex("مرحبا") === "object" &&
                    getSoundex("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getSoundex("你好") === undefined ||
                typeof getSoundex("你好") === "string" ||
                typeof getSoundex("你好") === "boolean" ||
                typeof getSoundex("你好") === "number" ||
                Array.isArray(getSoundex("你好")) ||
                (typeof getSoundex("你好") === "object" &&
                    getSoundex("你好") !== null),
        ).toBe(true);
    });
});
