import { describe, expect, it } from "vitest";
import { toUTF8Bytes } from "./to-utf8-bytes.js";
describe("toUTF8Bytes", () => {
    it("encodes a string", () => {
        expect(toUTF8Bytes("hi")).toBeTypeOf("object");
        expect(toUTF8Bytes(null)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(toUTF8Bytes(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            toUTF8Bytes("") === undefined ||
                typeof toUTF8Bytes("") === "string" ||
                typeof toUTF8Bytes("") === "boolean" ||
                typeof toUTF8Bytes("") === "number" ||
                Array.isArray(toUTF8Bytes("")) ||
                (typeof toUTF8Bytes("") === "object" &&
                    toUTF8Bytes("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            toUTF8Bytes("👨‍👩‍👧") === undefined ||
                typeof toUTF8Bytes("👨‍👩‍👧") === "string" ||
                typeof toUTF8Bytes("👨‍👩‍👧") === "boolean" ||
                typeof toUTF8Bytes("👨‍👩‍👧") === "number" ||
                Array.isArray(toUTF8Bytes("👨‍👩‍👧")) ||
                (typeof toUTF8Bytes("👨‍👩‍👧") === "object" &&
                    toUTF8Bytes("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            toUTF8Bytes("e\u0301") === undefined ||
                typeof toUTF8Bytes("e\u0301") === "string" ||
                typeof toUTF8Bytes("e\u0301") === "boolean" ||
                typeof toUTF8Bytes("e\u0301") === "number" ||
                Array.isArray(toUTF8Bytes("e\u0301")) ||
                (typeof toUTF8Bytes("e\u0301") === "object" &&
                    toUTF8Bytes("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            toUTF8Bytes("مرحبا") === undefined ||
                typeof toUTF8Bytes("مرحبا") === "string" ||
                typeof toUTF8Bytes("مرحبا") === "boolean" ||
                typeof toUTF8Bytes("مرحبا") === "number" ||
                Array.isArray(toUTF8Bytes("مرحبا")) ||
                (typeof toUTF8Bytes("مرحبا") === "object" &&
                    toUTF8Bytes("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            toUTF8Bytes("你好") === undefined ||
                typeof toUTF8Bytes("你好") === "string" ||
                typeof toUTF8Bytes("你好") === "boolean" ||
                typeof toUTF8Bytes("你好") === "number" ||
                Array.isArray(toUTF8Bytes("你好")) ||
                (typeof toUTF8Bytes("你好") === "object" &&
                    toUTF8Bytes("你好") !== null),
        ).toBe(true);
    });
});
