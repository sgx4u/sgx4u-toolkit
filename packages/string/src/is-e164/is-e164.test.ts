import { describe, expect, it } from "vitest";
import { isE164 } from "./is-e164.js";
describe("isE164", () => {
    it("checks the shape", () => {
        expect(isE164("+14155552671")).toBe(true);
        expect(isE164("123")).toBe(false);
        expect(isE164(null)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isE164(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isE164("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isE164("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isE164("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isE164("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isE164("你好")).toBe("boolean");
    });
});
