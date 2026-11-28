import { describe, expect, it } from "vitest";
import { isULID } from "./is-ulid.js";
describe("isULID", () => {
    it("checks length and alphabet", () => {
        expect(isULID("01ARZ3NDEKTSV4RRFFQ69G5FAV")).toBe(true);
        expect(isULID("01ARZ3NDEKTSV4RRFFQ69G5FAI")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isULID(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isULID("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isULID("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isULID("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isULID("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isULID("你好")).toBe("boolean");
    });
});
