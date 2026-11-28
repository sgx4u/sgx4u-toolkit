import { describe, expect, it } from "vitest";
import { isPostalCode } from "./is-postal-code.js";

describe("isPostalCode", () => {
    it("matches known country patterns", () => {
        expect(isPostalCode({ value: "90210", country: "US" })).toBe(true);
        expect(isPostalCode({ value: "90210-1234", country: "us" })).toBe(true);
        expect(isPostalCode({ value: "12345", country: "DE" })).toBe(true);
        expect(isPostalCode({ value: "SW1A 1AA", country: "GB" })).toBe(true);
        expect(isPostalCode({ value: "12", country: "US" })).toBe(false);
        expect(
            isPostalCode({ value: 1 as unknown as string, country: "US" }),
        ).toBe(false);
        expect(isPostalCode(null)).toBe(false);
    });

    it("requires a known country", () => {
        expect(() => isPostalCode("90210")).toThrow(RangeError);
        expect(() => isPostalCode({ value: "1", country: "ZZ" })).toThrow(
            RangeError,
        );
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isPostalCode(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isPostalCode({ value: "", country: "US" })).toBe(
            "boolean",
        );
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isPostalCode({ value: "👨‍👩‍👧", country: "US" })).toBe(
            "boolean",
        );
    });
    it("accepts a combining mark", () => {
        expect(typeof isPostalCode({ value: "e\u0301", country: "US" })).toBe(
            "boolean",
        );
    });
    it("accepts Arabic text", () => {
        expect(typeof isPostalCode({ value: "مرحبا", country: "US" })).toBe(
            "boolean",
        );
    });
    it("accepts CJK text", () => {
        expect(typeof isPostalCode({ value: "你好", country: "US" })).toBe(
            "boolean",
        );
    });
});
