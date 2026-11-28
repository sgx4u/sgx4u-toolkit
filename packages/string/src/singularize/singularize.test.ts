import { describe, expect, it } from "vitest";
import { singularize } from "./singularize.js";
describe("singularize", () => {
    it("singularizes irregulars and regulars", () => {
        expect(singularize("cities")).toBe("city");
        expect(singularize("buses")).toBe("bus");
        expect(singularize("people")).toBe("person");
        expect(singularize("children")).toBe("child");
        expect(singularize("mice")).toBe("mouse");
        expect(singularize("geese")).toBe("goose");
        expect(singularize("women")).toBe("woman");
        expect(singularize("data")).toBe("datum");
        expect(singularize("indexes")).toBe("index");
        expect(singularize("octopuses")).toBe("octopus");
        expect(singularize("sheep")).toBe("sheep");
        expect(singularize("bus")).toBe("bus");
        expect(() => singularize({ value: "cats", locale: "fr" })).toThrow(
            RangeError,
        );
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(singularize(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(typeof singularize("")).toBe("string");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof singularize("👨‍👩‍👧")).toBe("string");
    });
    it("accepts a combining mark", () => {
        expect(typeof singularize("e\u0301")).toBe("string");
    });
    it("accepts Arabic text", () => {
        expect(typeof singularize("مرحبا")).toBe("string");
    });
    it("accepts CJK text", () => {
        expect(typeof singularize("你好")).toBe("string");
    });
    it("throws when locale is empty or not text", () => {
        expect(() => singularize({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() => singularize({ value: "a", locale: 1 as never })).toThrow(
            TypeError,
        );
    });
});
