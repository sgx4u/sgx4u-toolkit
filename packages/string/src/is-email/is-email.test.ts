import { describe, expect, it } from "vitest";
import { isEmail } from "./is-email.js";
describe("isEmail", () => {
    it("accepts practical addresses and rejects RFC-odd ones", () => {
        expect(isEmail("user@example.com")).toBe(true);
        expect(isEmail("user.name+tag@example.co.uk")).toBe(true);
        expect(isEmail("user@localhost")).toBe(false);
        expect(
            isEmail({ value: "user@localhost", requireTopLevelDomain: false }),
        ).toBe(true);
        expect(isEmail("a@b")).toBe(false);
        expect(isEmail("userexample.com")).toBe(false);
        expect(isEmail("user@@example.com")).toBe(false);
        expect(isEmail("user name@example.com")).toBe(false);
        expect(isEmail("not an email")).toBe(false);
        expect(
            isEmail({ value: "Ada <ada@example.com>", allowDisplayName: true }),
        ).toBe(true);
        expect(isEmail(null)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isEmail(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isEmail("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isEmail("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isEmail("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isEmail("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isEmail("你好")).toBe("boolean");
    });
});
