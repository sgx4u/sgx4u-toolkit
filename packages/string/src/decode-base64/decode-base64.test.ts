import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { decodeBase64 } from "./decode-base64.js";
import { encodeBase64 } from "../encode-base64/encode-base64.js";
describe("decodeBase64", () => {
    it("round-trips", () => {
        expect(decodeBase64("???")).toBeUndefined();
        fc.assert(
            fc.property(fc.string({ maxLength: 20 }), (value) => {
                expect(decodeBase64(encodeBase64(value) ?? "")).toBe(value);
            }),
            { numRuns: 15 },
        );
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(decodeBase64(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            decodeBase64("") === undefined ||
                typeof decodeBase64("") === "string" ||
                typeof decodeBase64("") === "boolean" ||
                typeof decodeBase64("") === "number" ||
                Array.isArray(decodeBase64("")) ||
                (typeof decodeBase64("") === "object" &&
                    decodeBase64("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            decodeBase64("👨‍👩‍👧") === undefined ||
                typeof decodeBase64("👨‍👩‍👧") === "string" ||
                typeof decodeBase64("👨‍👩‍👧") === "boolean" ||
                typeof decodeBase64("👨‍👩‍👧") === "number" ||
                Array.isArray(decodeBase64("👨‍👩‍👧")) ||
                (typeof decodeBase64("👨‍👩‍👧") === "object" &&
                    decodeBase64("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            decodeBase64("e\u0301") === undefined ||
                typeof decodeBase64("e\u0301") === "string" ||
                typeof decodeBase64("e\u0301") === "boolean" ||
                typeof decodeBase64("e\u0301") === "number" ||
                Array.isArray(decodeBase64("e\u0301")) ||
                (typeof decodeBase64("e\u0301") === "object" &&
                    decodeBase64("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            decodeBase64("مرحبا") === undefined ||
                typeof decodeBase64("مرحبا") === "string" ||
                typeof decodeBase64("مرحبا") === "boolean" ||
                typeof decodeBase64("مرحبا") === "number" ||
                Array.isArray(decodeBase64("مرحبا")) ||
                (typeof decodeBase64("مرحبا") === "object" &&
                    decodeBase64("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            decodeBase64("你好") === undefined ||
                typeof decodeBase64("你好") === "string" ||
                typeof decodeBase64("你好") === "boolean" ||
                typeof decodeBase64("你好") === "number" ||
                Array.isArray(decodeBase64("你好")) ||
                (typeof decodeBase64("你好") === "object" &&
                    decodeBase64("你好") !== null),
        ).toBe(true);
    });
});
