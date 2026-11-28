import { describe, expect, it } from "vitest";
import { isNumericString } from "./is-numeric-string.js";

describe("isNumericString", () => {
    it("accepts digits and the optional sign or decimal", () => {
        expect(isNumericString("42")).toBe(true);
        expect(isNumericString("")).toBe(false);
        expect(isNumericString("-1")).toBe(false);
        expect(isNumericString({ value: "-1", allowSign: true })).toBe(true);
        expect(isNumericString({ value: "1.5", allowDecimal: true })).toBe(
            true,
        );
        expect(isNumericString({ value: "1.", allowDecimal: true })).toBe(
            false,
        );
        expect(isNumericString({ value: "1.2.3", allowDecimal: true })).toBe(
            false,
        );
        expect(isNumericString(null)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isNumericString(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isNumericString("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isNumericString("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isNumericString("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isNumericString("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isNumericString("你好")).toBe("boolean");
    });
});
