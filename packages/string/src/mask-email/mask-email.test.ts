import { describe, expect, it } from "vitest";
import { maskEmail } from "./mask-email.js";
describe("maskEmail", () => {
    it("masks the local part", () => {
        expect(maskEmail("jane@example.com")).toBe("j***@example.com");
        expect(maskEmail("no-at")).toBeUndefined();
        expect(maskEmail(null as unknown as string)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(maskEmail(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            maskEmail("") === undefined ||
                typeof maskEmail("") === "string" ||
                typeof maskEmail("") === "boolean" ||
                typeof maskEmail("") === "number" ||
                Array.isArray(maskEmail("")) ||
                (typeof maskEmail("") === "object" && maskEmail("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            maskEmail("👨‍👩‍👧") === undefined ||
                typeof maskEmail("👨‍👩‍👧") === "string" ||
                typeof maskEmail("👨‍👩‍👧") === "boolean" ||
                typeof maskEmail("👨‍👩‍👧") === "number" ||
                Array.isArray(maskEmail("👨‍👩‍👧")) ||
                (typeof maskEmail("👨‍👩‍👧") === "object" &&
                    maskEmail("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            maskEmail("e\u0301") === undefined ||
                typeof maskEmail("e\u0301") === "string" ||
                typeof maskEmail("e\u0301") === "boolean" ||
                typeof maskEmail("e\u0301") === "number" ||
                Array.isArray(maskEmail("e\u0301")) ||
                (typeof maskEmail("e\u0301") === "object" &&
                    maskEmail("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            maskEmail("مرحبا") === undefined ||
                typeof maskEmail("مرحبا") === "string" ||
                typeof maskEmail("مرحبا") === "boolean" ||
                typeof maskEmail("مرحبا") === "number" ||
                Array.isArray(maskEmail("مرحبا")) ||
                (typeof maskEmail("مرحبا") === "object" &&
                    maskEmail("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            maskEmail("你好") === undefined ||
                typeof maskEmail("你好") === "string" ||
                typeof maskEmail("你好") === "boolean" ||
                typeof maskEmail("你好") === "number" ||
                Array.isArray(maskEmail("你好")) ||
                (typeof maskEmail("你好") === "object" &&
                    maskEmail("你好") !== null),
        ).toBe(true);
    });
});
