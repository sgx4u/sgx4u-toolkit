import { describe, expect, it } from "vitest";
import { isIPv6 } from "./is-ipv6.js";
describe("isIPv6", () => {
    it("accepts compressed addresses", () => {
        expect(isIPv6("::1")).toBe(true);
        expect(isIPv6("2001:db8::1")).toBe(true);
        expect(isIPv6("gggg::")).toBe(false);
        expect(isIPv6(null)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isIPv6(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isIPv6("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isIPv6("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isIPv6("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isIPv6("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isIPv6("你好")).toBe("boolean");
    });
});
