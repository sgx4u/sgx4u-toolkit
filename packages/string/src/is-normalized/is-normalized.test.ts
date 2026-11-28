import { describe, expect, it } from "vitest";
import { isNormalized } from "./is-normalized.js";

describe("isNormalized", () => {
    it("compares a string with its normalized form", () => {
        expect(isNormalized("é")).toBe(true);
        expect(isNormalized("e\u0301")).toBe(false);
        expect(isNormalized({ value: "e\u0301", form: "NFD" })).toBe(true);
        expect(isNormalized({ value: "é", form: "NFD" })).toBe(false);
        expect(isNormalized("")).toBe(true);
        expect(isNormalized(null as never)).toBe(false);
        expect(isNormalized(new String("é") as never)).toBe(false);
    });

    it("rejects an unknown form", () => {
        expect(() =>
            isNormalized({ value: "a", form: "NFX" as "NFC" }),
        ).toThrow(RangeError);
        expect(() =>
            isNormalized({ value: "a", form: 1 as unknown as "NFC" }),
        ).toThrow(TypeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isNormalized(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isNormalized("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isNormalized("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isNormalized("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isNormalized("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isNormalized("你好")).toBe("boolean");
    });
});
