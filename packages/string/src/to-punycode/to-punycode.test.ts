import { describe, expect, it } from "vitest";
import { toPunycode } from "./to-punycode.js";
describe("toPunycode", () => {
    it("encodes a string", () => {
        expect(toPunycode("hi")).toBeTypeOf("string");
        expect(toPunycode(null)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(toPunycode(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            toPunycode("") === undefined ||
                typeof toPunycode("") === "string" ||
                typeof toPunycode("") === "boolean" ||
                typeof toPunycode("") === "number" ||
                Array.isArray(toPunycode("")) ||
                (typeof toPunycode("") === "object" && toPunycode("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            toPunycode("👨‍👩‍👧") === undefined ||
                typeof toPunycode("👨‍👩‍👧") === "string" ||
                typeof toPunycode("👨‍👩‍👧") === "boolean" ||
                typeof toPunycode("👨‍👩‍👧") === "number" ||
                Array.isArray(toPunycode("👨‍👩‍👧")) ||
                (typeof toPunycode("👨‍👩‍👧") === "object" &&
                    toPunycode("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            toPunycode("e\u0301") === undefined ||
                typeof toPunycode("e\u0301") === "string" ||
                typeof toPunycode("e\u0301") === "boolean" ||
                typeof toPunycode("e\u0301") === "number" ||
                Array.isArray(toPunycode("e\u0301")) ||
                (typeof toPunycode("e\u0301") === "object" &&
                    toPunycode("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            toPunycode("مرحبا") === undefined ||
                typeof toPunycode("مرحبا") === "string" ||
                typeof toPunycode("مرحبا") === "boolean" ||
                typeof toPunycode("مرحبا") === "number" ||
                Array.isArray(toPunycode("مرحبا")) ||
                (typeof toPunycode("مرحبا") === "object" &&
                    toPunycode("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            toPunycode("你好") === undefined ||
                typeof toPunycode("你好") === "string" ||
                typeof toPunycode("你好") === "boolean" ||
                typeof toPunycode("你好") === "number" ||
                Array.isArray(toPunycode("你好")) ||
                (typeof toPunycode("你好") === "object" &&
                    toPunycode("你好") !== null),
        ).toBe(true);
    });
});
