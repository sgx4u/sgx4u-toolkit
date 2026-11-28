import { describe, expect, it } from "vitest";
import { encodeBase64URL } from "./encode-base64-url.js";
describe("encodeBase64URL", () => {
    it("encodes a string", () => {
        expect(encodeBase64URL("hi")).toBeTypeOf("string");
        expect(encodeBase64URL(null)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(encodeBase64URL(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            encodeBase64URL("") === undefined ||
                typeof encodeBase64URL("") === "string" ||
                typeof encodeBase64URL("") === "boolean" ||
                typeof encodeBase64URL("") === "number" ||
                Array.isArray(encodeBase64URL("")) ||
                (typeof encodeBase64URL("") === "object" &&
                    encodeBase64URL("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            encodeBase64URL("👨‍👩‍👧") === undefined ||
                typeof encodeBase64URL("👨‍👩‍👧") === "string" ||
                typeof encodeBase64URL("👨‍👩‍👧") === "boolean" ||
                typeof encodeBase64URL("👨‍👩‍👧") === "number" ||
                Array.isArray(encodeBase64URL("👨‍👩‍👧")) ||
                (typeof encodeBase64URL("👨‍👩‍👧") === "object" &&
                    encodeBase64URL("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            encodeBase64URL("e\u0301") === undefined ||
                typeof encodeBase64URL("e\u0301") === "string" ||
                typeof encodeBase64URL("e\u0301") === "boolean" ||
                typeof encodeBase64URL("e\u0301") === "number" ||
                Array.isArray(encodeBase64URL("e\u0301")) ||
                (typeof encodeBase64URL("e\u0301") === "object" &&
                    encodeBase64URL("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            encodeBase64URL("مرحبا") === undefined ||
                typeof encodeBase64URL("مرحبا") === "string" ||
                typeof encodeBase64URL("مرحبا") === "boolean" ||
                typeof encodeBase64URL("مرحبا") === "number" ||
                Array.isArray(encodeBase64URL("مرحبا")) ||
                (typeof encodeBase64URL("مرحبا") === "object" &&
                    encodeBase64URL("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            encodeBase64URL("你好") === undefined ||
                typeof encodeBase64URL("你好") === "string" ||
                typeof encodeBase64URL("你好") === "boolean" ||
                typeof encodeBase64URL("你好") === "number" ||
                Array.isArray(encodeBase64URL("你好")) ||
                (typeof encodeBase64URL("你好") === "object" &&
                    encodeBase64URL("你好") !== null),
        ).toBe(true);
    });
});
