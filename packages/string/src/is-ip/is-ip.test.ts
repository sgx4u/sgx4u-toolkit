import { describe, expect, it } from "vitest";
import { isIP } from "./is-ip.js";
describe("isIP", () => {
    it("accepts either version", () => {
        expect(isIP("127.0.0.1")).toBe(true);
        expect(isIP("::1")).toBe(true);
        expect(isIP({ value: "::1", version: 4 })).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isIP(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isIP("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isIP("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isIP("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isIP("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isIP("你好")).toBe("boolean");
    });
});
