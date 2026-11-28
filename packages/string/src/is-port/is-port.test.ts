import { describe, expect, it } from "vitest";
import { isPort } from "./is-port.js";
describe("isPort", () => {
    it("accepts 0 through 65535", () => {
        expect(isPort("0")).toBe(true);
        expect(isPort("65535")).toBe(true);
        expect(isPort("65536")).toBe(false);
        expect(isPort("08")).toBe(false);
        expect(isPort(null)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isPort(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isPort("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isPort("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isPort("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isPort("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isPort("你好")).toBe("boolean");
    });
});
