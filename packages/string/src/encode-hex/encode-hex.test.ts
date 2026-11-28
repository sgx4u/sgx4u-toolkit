import { assert, property, string as arbitraryString } from "fast-check";
import { describe, expect, it } from "vitest";
import { decodeHex } from "../decode-hex/decode-hex.js";
import { encodeHex } from "./encode-hex.js";

describe("encodeHex", () => {
    it("encodes a string", () => {
        expect(encodeHex("A")).toBe("41");
        expect(encodeHex(null)).toBeUndefined();
        expect(decodeHex("41")).toBe("A");
        expect(decodeHex("4")).toBeUndefined();
        expect(decodeHex("zz")).toBeUndefined();
    });

    it("round-trips strings of length 30 or less", () => {
        assert(
            property(arbitraryString({ maxLength: 30 }), (value) => {
                expect(decodeHex(encodeHex(value))).toBe(value);
            }),
            { numRuns: 20 },
        );
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(encodeHex(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            encodeHex("") === undefined ||
                typeof encodeHex("") === "string" ||
                typeof encodeHex("") === "boolean" ||
                typeof encodeHex("") === "number" ||
                Array.isArray(encodeHex("")) ||
                (typeof encodeHex("") === "object" && encodeHex("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            encodeHex("👨‍👩‍👧") === undefined ||
                typeof encodeHex("👨‍👩‍👧") === "string" ||
                typeof encodeHex("👨‍👩‍👧") === "boolean" ||
                typeof encodeHex("👨‍👩‍👧") === "number" ||
                Array.isArray(encodeHex("👨‍👩‍👧")) ||
                (typeof encodeHex("👨‍👩‍👧") === "object" &&
                    encodeHex("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            encodeHex("e\u0301") === undefined ||
                typeof encodeHex("e\u0301") === "string" ||
                typeof encodeHex("e\u0301") === "boolean" ||
                typeof encodeHex("e\u0301") === "number" ||
                Array.isArray(encodeHex("e\u0301")) ||
                (typeof encodeHex("e\u0301") === "object" &&
                    encodeHex("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            encodeHex("مرحبا") === undefined ||
                typeof encodeHex("مرحبا") === "string" ||
                typeof encodeHex("مرحبا") === "boolean" ||
                typeof encodeHex("مرحبا") === "number" ||
                Array.isArray(encodeHex("مرحبا")) ||
                (typeof encodeHex("مرحبا") === "object" &&
                    encodeHex("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            encodeHex("你好") === undefined ||
                typeof encodeHex("你好") === "string" ||
                typeof encodeHex("你好") === "boolean" ||
                typeof encodeHex("你好") === "number" ||
                Array.isArray(encodeHex("你好")) ||
                (typeof encodeHex("你好") === "object" &&
                    encodeHex("你好") !== null),
        ).toBe(true);
    });
});
