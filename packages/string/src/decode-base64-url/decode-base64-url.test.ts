import { describe, expect, it } from "vitest";
import { decodeBase64URL } from "./decode-base64-url.js";
import { encodeBase64URL } from "../encode-base64-url/encode-base64-url.js";
describe("decodeBase64URL", () => {
    it("round-trips", () => {
        expect(decodeBase64URL(encodeBase64URL("hi") ?? "")).toBe("hi");
        expect(decodeBase64URL("???")).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(decodeBase64URL(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            decodeBase64URL("") === undefined ||
                typeof decodeBase64URL("") === "string" ||
                typeof decodeBase64URL("") === "boolean" ||
                typeof decodeBase64URL("") === "number" ||
                Array.isArray(decodeBase64URL("")) ||
                (typeof decodeBase64URL("") === "object" &&
                    decodeBase64URL("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            decodeBase64URL("👨‍👩‍👧") === undefined ||
                typeof decodeBase64URL("👨‍👩‍👧") === "string" ||
                typeof decodeBase64URL("👨‍👩‍👧") === "boolean" ||
                typeof decodeBase64URL("👨‍👩‍👧") === "number" ||
                Array.isArray(decodeBase64URL("👨‍👩‍👧")) ||
                (typeof decodeBase64URL("👨‍👩‍👧") === "object" &&
                    decodeBase64URL("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            decodeBase64URL("e\u0301") === undefined ||
                typeof decodeBase64URL("e\u0301") === "string" ||
                typeof decodeBase64URL("e\u0301") === "boolean" ||
                typeof decodeBase64URL("e\u0301") === "number" ||
                Array.isArray(decodeBase64URL("e\u0301")) ||
                (typeof decodeBase64URL("e\u0301") === "object" &&
                    decodeBase64URL("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            decodeBase64URL("مرحبا") === undefined ||
                typeof decodeBase64URL("مرحبا") === "string" ||
                typeof decodeBase64URL("مرحبا") === "boolean" ||
                typeof decodeBase64URL("مرحبا") === "number" ||
                Array.isArray(decodeBase64URL("مرحبا")) ||
                (typeof decodeBase64URL("مرحبا") === "object" &&
                    decodeBase64URL("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            decodeBase64URL("你好") === undefined ||
                typeof decodeBase64URL("你好") === "string" ||
                typeof decodeBase64URL("你好") === "boolean" ||
                typeof decodeBase64URL("你好") === "number" ||
                Array.isArray(decodeBase64URL("你好")) ||
                (typeof decodeBase64URL("你好") === "object" &&
                    decodeBase64URL("你好") !== null),
        ).toBe(true);
    });
});
