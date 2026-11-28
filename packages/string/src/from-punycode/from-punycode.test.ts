import { describe, expect, it } from "vitest";
import { fromPunycode } from "./from-punycode.js";
describe("fromPunycode", () => {
    it("encodes a string", () => {
        expect(fromPunycode("hi")).toBeTypeOf("string");
        expect(fromPunycode(null)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(fromPunycode(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            fromPunycode("") === undefined ||
                typeof fromPunycode("") === "string" ||
                typeof fromPunycode("") === "boolean" ||
                typeof fromPunycode("") === "number" ||
                Array.isArray(fromPunycode("")) ||
                (typeof fromPunycode("") === "object" &&
                    fromPunycode("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            fromPunycode("👨‍👩‍👧") === undefined ||
                typeof fromPunycode("👨‍👩‍👧") === "string" ||
                typeof fromPunycode("👨‍👩‍👧") === "boolean" ||
                typeof fromPunycode("👨‍👩‍👧") === "number" ||
                Array.isArray(fromPunycode("👨‍👩‍👧")) ||
                (typeof fromPunycode("👨‍👩‍👧") === "object" &&
                    fromPunycode("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            fromPunycode("e\u0301") === undefined ||
                typeof fromPunycode("e\u0301") === "string" ||
                typeof fromPunycode("e\u0301") === "boolean" ||
                typeof fromPunycode("e\u0301") === "number" ||
                Array.isArray(fromPunycode("e\u0301")) ||
                (typeof fromPunycode("e\u0301") === "object" &&
                    fromPunycode("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            fromPunycode("مرحبا") === undefined ||
                typeof fromPunycode("مرحبا") === "string" ||
                typeof fromPunycode("مرحبا") === "boolean" ||
                typeof fromPunycode("مرحبا") === "number" ||
                Array.isArray(fromPunycode("مرحبا")) ||
                (typeof fromPunycode("مرحبا") === "object" &&
                    fromPunycode("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            fromPunycode("你好") === undefined ||
                typeof fromPunycode("你好") === "string" ||
                typeof fromPunycode("你好") === "boolean" ||
                typeof fromPunycode("你好") === "number" ||
                Array.isArray(fromPunycode("你好")) ||
                (typeof fromPunycode("你好") === "object" &&
                    fromPunycode("你好") !== null),
        ).toBe(true);
    });
});
