import { describe, expect, it } from "vitest";
import { isVAT } from "./is-vat.js";

describe("isVAT", () => {
    it("checks Belgium, the United Kingdom, and the Netherlands", () => {
        expect(isVAT("BE0428759497")).toBe(true);
        expect(isVAT("BE 0428.7594-97")).toBe(true);
        expect(isVAT("BE0428759498")).toBe(false);
        expect(isVAT("GB123456782")).toBe(true);
        expect(isVAT("GB123456783")).toBe(false);
        expect(isVAT("GB123456782001")).toBe(true);
        expect(isVAT("NL123456782B01")).toBe(true);
        expect(isVAT("NL123456783B01")).toBe(false);
        expect(isVAT({ value: "0428759497", country: "BE" })).toBe(true);
    });

    it("uses patterns for other prefixes", () => {
        expect(isVAT("DE123456789")).toBe(true);
        expect(isVAT("DE12345678")).toBe(false);
        expect(isVAT("FRAB123456789")).toBe(true);
        expect(isVAT("XX123")).toBe(false);
        expect(isVAT({ value: "BE0428759497", country: "NL" })).toBe(false);
        expect(isVAT(null)).toBe(false);
        expect(() => isVAT({ value: "1", country: "ZZ" })).toThrow(RangeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isVAT(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isVAT("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isVAT("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isVAT("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isVAT("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isVAT("你好")).toBe("boolean");
    });
});
