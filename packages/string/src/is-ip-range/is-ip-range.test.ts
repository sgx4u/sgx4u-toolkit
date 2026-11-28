import { describe, expect, it } from "vitest";
import { isIPRange } from "./is-ip-range.js";
describe("isIPRange", () => {
    it("accepts CIDR", () => {
        expect(isIPRange("127.0.0.1/24")).toBe(true);
        expect(isIPRange("::1/128")).toBe(true);
        expect(isIPRange("127.0.0.1/33")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isIPRange(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isIPRange("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isIPRange("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isIPRange("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isIPRange("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isIPRange("你好")).toBe("boolean");
    });
});
