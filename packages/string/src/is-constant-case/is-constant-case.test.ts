import { describe, expect, it } from "vitest";
import { isConstantCase } from "./is-constant-case.js";

describe("isConstantCase", () => {
    it("accepts the constant-case conversion", () => {
        expect(isConstantCase("FOO_BAR")).toBe(true);
        expect(isConstantCase("FOO")).toBe(true);
        expect(isConstantCase("foo_bar")).toBe(false);
        expect(isConstantCase("")).toBe(false);
        expect(isConstantCase(null)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isConstantCase(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isConstantCase("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isConstantCase("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isConstantCase("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isConstantCase("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isConstantCase("你好")).toBe("boolean");
    });
});
