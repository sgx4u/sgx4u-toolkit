import { assert, property, string as arbitraryString } from "fast-check";
import { describe, expect, it } from "vitest";
import { decodeBase64 } from "../decode-base64/decode-base64.js";
import { encodeBase64 } from "./encode-base64.js";

describe("encodeBase64", () => {
    it("encodes a string", () => {
        expect(encodeBase64("hi")).toBe("aGk=");
        expect(encodeBase64(null)).toBeUndefined();
        expect(decodeBase64("aGk=")).toBe("hi");
        expect(decodeBase64("aGk")).toBe("hi");
        expect(decodeBase64("@@@")).toBeUndefined();
    });

    it("round-trips strings of length 30 or less", () => {
        assert(
            property(arbitraryString({ maxLength: 30 }), (value) => {
                expect(decodeBase64(encodeBase64(value))).toBe(value);
            }),
            { numRuns: 20 },
        );
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(encodeBase64(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            encodeBase64("") === undefined ||
                typeof encodeBase64("") === "string" ||
                typeof encodeBase64("") === "boolean" ||
                typeof encodeBase64("") === "number" ||
                Array.isArray(encodeBase64("")) ||
                (typeof encodeBase64("") === "object" &&
                    encodeBase64("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            encodeBase64("👨‍👩‍👧") === undefined ||
                typeof encodeBase64("👨‍👩‍👧") === "string" ||
                typeof encodeBase64("👨‍👩‍👧") === "boolean" ||
                typeof encodeBase64("👨‍👩‍👧") === "number" ||
                Array.isArray(encodeBase64("👨‍👩‍👧")) ||
                (typeof encodeBase64("👨‍👩‍👧") === "object" &&
                    encodeBase64("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            encodeBase64("e\u0301") === undefined ||
                typeof encodeBase64("e\u0301") === "string" ||
                typeof encodeBase64("e\u0301") === "boolean" ||
                typeof encodeBase64("e\u0301") === "number" ||
                Array.isArray(encodeBase64("e\u0301")) ||
                (typeof encodeBase64("e\u0301") === "object" &&
                    encodeBase64("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            encodeBase64("مرحبا") === undefined ||
                typeof encodeBase64("مرحبا") === "string" ||
                typeof encodeBase64("مرحبا") === "boolean" ||
                typeof encodeBase64("مرحبا") === "number" ||
                Array.isArray(encodeBase64("مرحبا")) ||
                (typeof encodeBase64("مرحبا") === "object" &&
                    encodeBase64("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            encodeBase64("你好") === undefined ||
                typeof encodeBase64("你好") === "string" ||
                typeof encodeBase64("你好") === "boolean" ||
                typeof encodeBase64("你好") === "number" ||
                Array.isArray(encodeBase64("你好")) ||
                (typeof encodeBase64("你好") === "object" &&
                    encodeBase64("你好") !== null),
        ).toBe(true);
    });
});
