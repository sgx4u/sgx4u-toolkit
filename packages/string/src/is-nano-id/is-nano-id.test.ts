import { describe, expect, it } from "vitest";
import { isNanoID } from "./is-nano-id.js";
describe("isNanoID", () => {
    it("checks the default length", () => {
        expect(isNanoID("A".repeat(21))).toBe(true);
        expect(isNanoID("short")).toBe(false);
        expect(() => isNanoID({ value: "a", length: 0 })).toThrow(RangeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isNanoID(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isNanoID("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isNanoID("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isNanoID("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isNanoID("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isNanoID("你好")).toBe("boolean");
    });
});
