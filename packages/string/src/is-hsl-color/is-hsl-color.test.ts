import { describe, expect, it } from "vitest";
import { isHSLColor } from "./is-hsl-color.js";
describe("isHSLColor", () => {
    it("accepts function syntax", () => {
        expect(isHSLColor("hsl(120, 50%, 40%)")).toBe(true);
        expect(isHSLColor("hsl(120 50% 40% / 50%)")).toBe(true);
        expect(isHSLColor("red")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isHSLColor(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isHSLColor("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isHSLColor("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isHSLColor("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isHSLColor("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isHSLColor("你好")).toBe("boolean");
    });
});
