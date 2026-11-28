import { describe, expect, it } from "vitest";
import { isTrainCase } from "./is-train-case.js";

describe("isTrainCase", () => {
    it("accepts the train-case conversion", () => {
        expect(isTrainCase("Xml-Http-Request")).toBe(true);
        expect(isTrainCase("Foo")).toBe(true);
        expect(isTrainCase("foo-bar")).toBe(false);
        expect(isTrainCase("")).toBe(false);
        expect(isTrainCase(null)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isTrainCase(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isTrainCase("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isTrainCase("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isTrainCase("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isTrainCase("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isTrainCase("你好")).toBe("boolean");
    });
});
