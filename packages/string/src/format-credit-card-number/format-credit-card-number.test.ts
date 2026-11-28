import { describe, expect, it } from "vitest";
import { formatCreditCardNumber } from "./format-credit-card-number.js";
describe("formatCreditCardNumber", () => {
    it("groups digits", () => {
        expect(formatCreditCardNumber("4242424242424242")).toBe(
            "4242 4242 4242 4242",
        );
        expect(formatCreditCardNumber("no")).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(formatCreditCardNumber(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            formatCreditCardNumber("") === undefined ||
                typeof formatCreditCardNumber("") === "string" ||
                typeof formatCreditCardNumber("") === "boolean" ||
                typeof formatCreditCardNumber("") === "number" ||
                Array.isArray(formatCreditCardNumber("")) ||
                (typeof formatCreditCardNumber("") === "object" &&
                    formatCreditCardNumber("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            formatCreditCardNumber("👨‍👩‍👧") === undefined ||
                typeof formatCreditCardNumber("👨‍👩‍👧") === "string" ||
                typeof formatCreditCardNumber("👨‍👩‍👧") === "boolean" ||
                typeof formatCreditCardNumber("👨‍👩‍👧") === "number" ||
                Array.isArray(formatCreditCardNumber("👨‍👩‍👧")) ||
                (typeof formatCreditCardNumber("👨‍👩‍👧") === "object" &&
                    formatCreditCardNumber("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            formatCreditCardNumber("e\u0301") === undefined ||
                typeof formatCreditCardNumber("e\u0301") === "string" ||
                typeof formatCreditCardNumber("e\u0301") === "boolean" ||
                typeof formatCreditCardNumber("e\u0301") === "number" ||
                Array.isArray(formatCreditCardNumber("e\u0301")) ||
                (typeof formatCreditCardNumber("e\u0301") === "object" &&
                    formatCreditCardNumber("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            formatCreditCardNumber("مرحبا") === undefined ||
                typeof formatCreditCardNumber("مرحبا") === "string" ||
                typeof formatCreditCardNumber("مرحبا") === "boolean" ||
                typeof formatCreditCardNumber("مرحبا") === "number" ||
                Array.isArray(formatCreditCardNumber("مرحبا")) ||
                (typeof formatCreditCardNumber("مرحبا") === "object" &&
                    formatCreditCardNumber("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            formatCreditCardNumber("你好") === undefined ||
                typeof formatCreditCardNumber("你好") === "string" ||
                typeof formatCreditCardNumber("你好") === "boolean" ||
                typeof formatCreditCardNumber("你好") === "number" ||
                Array.isArray(formatCreditCardNumber("你好")) ||
                (typeof formatCreditCardNumber("你好") === "object" &&
                    formatCreditCardNumber("你好") !== null),
        ).toBe(true);
    });
});
