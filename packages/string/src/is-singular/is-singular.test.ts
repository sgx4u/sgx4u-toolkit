import { describe, expect, it } from "vitest";
import { isSingular } from "./is-singular.js";
describe("isSingular", () => {
    it("detects singulars", () => {
        expect(isSingular("cat")).toBe(true);
        expect(isSingular("cats")).toBe(false);
        expect(isSingular("sheep")).toBe(true);
        expect(isSingular(null as unknown as string)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isSingular(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isSingular("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isSingular("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isSingular("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isSingular("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isSingular("你好")).toBe("boolean");
    });
    it("throws when locale is empty or not text", () => {
        expect(() => isSingular({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() => isSingular({ value: "a", locale: 1 as never })).toThrow(
            TypeError,
        );
    });
});
