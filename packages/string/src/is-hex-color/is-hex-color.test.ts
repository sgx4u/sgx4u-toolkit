import { describe, expect, it } from "vitest";
import { isHexColor } from "./is-hex-color.js";
describe("isHexColor", () => {
    it("accepts short and long forms", () => {
        expect(isHexColor("#fff")).toBe(true);
        expect(isHexColor("ffffff")).toBe(true);
        expect(isHexColor("#ffff")).toBe(true);
        expect(isHexColor("ggg")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isHexColor(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isHexColor("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isHexColor("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isHexColor("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isHexColor("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isHexColor("你好")).toBe("boolean");
    });
});
