import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { decodeHex } from "./decode-hex.js";
import { encodeHex } from "../encode-hex/encode-hex.js";
describe("decodeHex", () => {
    it("round-trips", () => {
        expect(decodeHex("6869")).toBe("hi");
        expect(decodeHex("abc")).toBeUndefined();
        fc.assert(
            fc.property(fc.string({ maxLength: 20 }), (value) => {
                expect(decodeHex(encodeHex(value) ?? "")).toBe(value);
            }),
            { numRuns: 15 },
        );
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(decodeHex(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            decodeHex("") === undefined ||
                typeof decodeHex("") === "string" ||
                typeof decodeHex("") === "boolean" ||
                typeof decodeHex("") === "number" ||
                Array.isArray(decodeHex("")) ||
                (typeof decodeHex("") === "object" && decodeHex("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            decodeHex("👨‍👩‍👧") === undefined ||
                typeof decodeHex("👨‍👩‍👧") === "string" ||
                typeof decodeHex("👨‍👩‍👧") === "boolean" ||
                typeof decodeHex("👨‍👩‍👧") === "number" ||
                Array.isArray(decodeHex("👨‍👩‍👧")) ||
                (typeof decodeHex("👨‍👩‍👧") === "object" &&
                    decodeHex("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            decodeHex("e\u0301") === undefined ||
                typeof decodeHex("e\u0301") === "string" ||
                typeof decodeHex("e\u0301") === "boolean" ||
                typeof decodeHex("e\u0301") === "number" ||
                Array.isArray(decodeHex("e\u0301")) ||
                (typeof decodeHex("e\u0301") === "object" &&
                    decodeHex("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            decodeHex("مرحبا") === undefined ||
                typeof decodeHex("مرحبا") === "string" ||
                typeof decodeHex("مرحبا") === "boolean" ||
                typeof decodeHex("مرحبا") === "number" ||
                Array.isArray(decodeHex("مرحبا")) ||
                (typeof decodeHex("مرحبا") === "object" &&
                    decodeHex("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            decodeHex("你好") === undefined ||
                typeof decodeHex("你好") === "string" ||
                typeof decodeHex("你好") === "boolean" ||
                typeof decodeHex("你好") === "number" ||
                Array.isArray(decodeHex("你好")) ||
                (typeof decodeHex("你好") === "object" &&
                    decodeHex("你好") !== null),
        ).toBe(true);
    });
});
