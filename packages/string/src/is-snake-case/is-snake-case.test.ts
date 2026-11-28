import { describe, expect, it } from "vitest";
import { isSnakeCase } from "./is-snake-case.js";

describe("isSnakeCase", () => {
    it("accepts the snake-case conversion", () => {
        expect(isSnakeCase("foo_bar")).toBe(true);
        expect(isSnakeCase("v_1_2")).toBe(true);
        expect(isSnakeCase("foo")).toBe(true);
        expect(isSnakeCase("fooBar")).toBe(false);
        expect(isSnakeCase("")).toBe(false);
        expect(isSnakeCase(null)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isSnakeCase(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isSnakeCase("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isSnakeCase("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isSnakeCase("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isSnakeCase("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isSnakeCase("你好")).toBe("boolean");
    });
});
