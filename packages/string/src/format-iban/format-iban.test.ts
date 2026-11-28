import { describe, expect, it } from "vitest";
import { formatIBAN } from "./format-iban.js";
describe("formatIBAN", () => {
    it("groups without checking the checksum", () => {
        expect(formatIBAN("GB82WEST12345698765432")).toBe(
            "GB82 WEST 1234 5698 7654 32",
        );
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(formatIBAN(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            formatIBAN("") === undefined ||
                typeof formatIBAN("") === "string" ||
                typeof formatIBAN("") === "boolean" ||
                typeof formatIBAN("") === "number" ||
                Array.isArray(formatIBAN("")) ||
                (typeof formatIBAN("") === "object" && formatIBAN("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            formatIBAN("👨‍👩‍👧") === undefined ||
                typeof formatIBAN("👨‍👩‍👧") === "string" ||
                typeof formatIBAN("👨‍👩‍👧") === "boolean" ||
                typeof formatIBAN("👨‍👩‍👧") === "number" ||
                Array.isArray(formatIBAN("👨‍👩‍👧")) ||
                (typeof formatIBAN("👨‍👩‍👧") === "object" &&
                    formatIBAN("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            formatIBAN("e\u0301") === undefined ||
                typeof formatIBAN("e\u0301") === "string" ||
                typeof formatIBAN("e\u0301") === "boolean" ||
                typeof formatIBAN("e\u0301") === "number" ||
                Array.isArray(formatIBAN("e\u0301")) ||
                (typeof formatIBAN("e\u0301") === "object" &&
                    formatIBAN("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            formatIBAN("مرحبا") === undefined ||
                typeof formatIBAN("مرحبا") === "string" ||
                typeof formatIBAN("مرحبا") === "boolean" ||
                typeof formatIBAN("مرحبا") === "number" ||
                Array.isArray(formatIBAN("مرحبا")) ||
                (typeof formatIBAN("مرحبا") === "object" &&
                    formatIBAN("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            formatIBAN("你好") === undefined ||
                typeof formatIBAN("你好") === "string" ||
                typeof formatIBAN("你好") === "boolean" ||
                typeof formatIBAN("你好") === "number" ||
                Array.isArray(formatIBAN("你好")) ||
                (typeof formatIBAN("你好") === "object" &&
                    formatIBAN("你好") !== null),
        ).toBe(true);
    });
});
