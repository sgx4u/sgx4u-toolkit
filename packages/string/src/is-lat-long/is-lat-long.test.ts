import { describe, expect, it } from "vitest";
import { isLatLong } from "./is-lat-long.js";
describe("isLatLong", () => {
    it("checks the ranges", () => {
        expect(isLatLong("12.5, 77.5")).toBe(true);
        expect(isLatLong("91, 0")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isLatLong(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isLatLong("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isLatLong("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isLatLong("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isLatLong("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isLatLong("你好")).toBe("boolean");
    });
});
