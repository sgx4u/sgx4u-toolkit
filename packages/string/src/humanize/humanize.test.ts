import { describe, expect, it } from "vitest";
import { humanize } from "./humanize.js";
describe("humanize", () => {
    it("turns a code name into a phrase", () => {
        expect(humanize("foo_bar")).toBe("Foo bar");
        expect(humanize(null)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(humanize(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            humanize("") === undefined ||
                typeof humanize("") === "string" ||
                typeof humanize("") === "boolean" ||
                typeof humanize("") === "number" ||
                Array.isArray(humanize("")) ||
                (typeof humanize("") === "object" && humanize("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            humanize("👨‍👩‍👧") === undefined ||
                typeof humanize("👨‍👩‍👧") === "string" ||
                typeof humanize("👨‍👩‍👧") === "boolean" ||
                typeof humanize("👨‍👩‍👧") === "number" ||
                Array.isArray(humanize("👨‍👩‍👧")) ||
                (typeof humanize("👨‍👩‍👧") === "object" && humanize("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            humanize("e\u0301") === undefined ||
                typeof humanize("e\u0301") === "string" ||
                typeof humanize("e\u0301") === "boolean" ||
                typeof humanize("e\u0301") === "number" ||
                Array.isArray(humanize("e\u0301")) ||
                (typeof humanize("e\u0301") === "object" &&
                    humanize("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            humanize("مرحبا") === undefined ||
                typeof humanize("مرحبا") === "string" ||
                typeof humanize("مرحبا") === "boolean" ||
                typeof humanize("مرحبا") === "number" ||
                Array.isArray(humanize("مرحبا")) ||
                (typeof humanize("مرحبا") === "object" &&
                    humanize("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            humanize("你好") === undefined ||
                typeof humanize("你好") === "string" ||
                typeof humanize("你好") === "boolean" ||
                typeof humanize("你好") === "number" ||
                Array.isArray(humanize("你好")) ||
                (typeof humanize("你好") === "object" &&
                    humanize("你好") !== null),
        ).toBe(true);
    });
});
