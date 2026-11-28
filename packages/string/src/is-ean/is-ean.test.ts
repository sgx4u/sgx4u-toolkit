import { describe, expect, it } from "vitest";
import { isEAN } from "./is-ean.js";
describe("isEAN", () => {
    it("checks EAN-13", () => {
        expect(isEAN("4006381333931")).toBe(true);
        expect(isEAN("4006381333932")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isEAN(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isEAN("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isEAN("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isEAN("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isEAN("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isEAN("你好")).toBe("boolean");
    });
});
