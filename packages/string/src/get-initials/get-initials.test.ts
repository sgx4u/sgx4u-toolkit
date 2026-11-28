import { describe, expect, it } from "vitest";
import { getInitials } from "./get-initials.js";
describe("getInitials", () => {
    it("takes the first grapheme of each word", () => {
        expect(getInitials("Mary Jane Watson")).toBe("MJ");
        expect(
            getInitials({ value: "Mary Jane Watson", maximumLength: 3 }),
        ).toBe("MJW");
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getInitials(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(getInitials("")).toBe("");
    });
    it("accepts a family emoji grapheme", () => {
        expect(getInitials("👨‍👩‍👧")).toBe("👨‍👩‍👧");
    });
    it("accepts a combining mark", () => {
        expect(typeof getInitials("e\u0301")).toBe("string");
    });
    it("accepts Arabic text", () => {
        expect(typeof getInitials("مرحبا")).toBe("string");
    });
    it("accepts CJK text", () => {
        expect(getInitials("你好")).toBe("你");
    });
    it("throws when locale is empty or not text", () => {
        expect(() => getInitials({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() => getInitials({ value: "a", locale: 1 as never })).toThrow(
            TypeError,
        );
    });
});
