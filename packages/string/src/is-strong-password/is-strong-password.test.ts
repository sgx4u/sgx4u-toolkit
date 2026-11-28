import { describe, expect, it } from "vitest";
import { isStrongPassword } from "./is-strong-password.js";
describe("isStrongPassword", () => {
    it("checks the default policy", () => {
        expect(isStrongPassword("Abcdef1!")).toBe(true);
        expect(isStrongPassword("abcdef")).toBe(false);
        expect(
            isStrongPassword({
                value: "abcdefgh",
                requireUppercase: false,
                requireNumber: false,
                requireSymbol: false,
            }),
        ).toBe(true);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isStrongPassword(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isStrongPassword("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isStrongPassword("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isStrongPassword("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isStrongPassword("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isStrongPassword("你好")).toBe("boolean");
    });
});
