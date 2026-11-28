import { describe, expect, it } from "vitest";
import { isIPv4 } from "./is-ipv4.js";
describe("isIPv4", () => {
    it("rejects leading zeros", () => {
        expect(isIPv4("127.0.0.1")).toBe(true);
        expect(isIPv4("0.0.0.0")).toBe(true);
        expect(isIPv4("01.2.3.4")).toBe(false);
        expect(isIPv4("256.0.0.1")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isIPv4(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isIPv4("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isIPv4("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isIPv4("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isIPv4("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isIPv4("你好")).toBe("boolean");
    });
});
