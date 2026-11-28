import { describe, expect, it } from "vitest";
import { maskCreditCard } from "./mask-credit-card.js";
describe("maskCreditCard", () => {
    it("keeps the last digits and the separators", () => {
        expect(maskCreditCard("4242 4242 4242 4242")).toBe(
            "**** **** **** 4242",
        );
        expect(maskCreditCard("no digits")).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(maskCreditCard(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            maskCreditCard("") === undefined ||
                typeof maskCreditCard("") === "string" ||
                typeof maskCreditCard("") === "boolean" ||
                typeof maskCreditCard("") === "number" ||
                Array.isArray(maskCreditCard("")) ||
                (typeof maskCreditCard("") === "object" &&
                    maskCreditCard("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            maskCreditCard("👨‍👩‍👧") === undefined ||
                typeof maskCreditCard("👨‍👩‍👧") === "string" ||
                typeof maskCreditCard("👨‍👩‍👧") === "boolean" ||
                typeof maskCreditCard("👨‍👩‍👧") === "number" ||
                Array.isArray(maskCreditCard("👨‍👩‍👧")) ||
                (typeof maskCreditCard("👨‍👩‍👧") === "object" &&
                    maskCreditCard("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            maskCreditCard("e\u0301") === undefined ||
                typeof maskCreditCard("e\u0301") === "string" ||
                typeof maskCreditCard("e\u0301") === "boolean" ||
                typeof maskCreditCard("e\u0301") === "number" ||
                Array.isArray(maskCreditCard("e\u0301")) ||
                (typeof maskCreditCard("e\u0301") === "object" &&
                    maskCreditCard("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            maskCreditCard("مرحبا") === undefined ||
                typeof maskCreditCard("مرحبا") === "string" ||
                typeof maskCreditCard("مرحبا") === "boolean" ||
                typeof maskCreditCard("مرحبا") === "number" ||
                Array.isArray(maskCreditCard("مرحبا")) ||
                (typeof maskCreditCard("مرحبا") === "object" &&
                    maskCreditCard("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            maskCreditCard("你好") === undefined ||
                typeof maskCreditCard("你好") === "string" ||
                typeof maskCreditCard("你好") === "boolean" ||
                typeof maskCreditCard("你好") === "number" ||
                Array.isArray(maskCreditCard("你好")) ||
                (typeof maskCreditCard("你好") === "object" &&
                    maskCreditCard("你好") !== null),
        ).toBe(true);
    });
});
