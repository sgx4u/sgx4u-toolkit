import { describe, expect, it } from "vitest";
import { isRGBColor } from "./is-rgb-color.js";
describe("isRGBColor", () => {
    it("accepts function syntax", () => {
        expect(isRGBColor("rgb(1, 2, 3)")).toBe(true);
        expect(isRGBColor("rgb(1 2 3 / 0.5)")).toBe(true);
        expect(isRGBColor("red")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isRGBColor(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isRGBColor("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isRGBColor("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isRGBColor("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isRGBColor("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isRGBColor("你好")).toBe("boolean");
    });
});
