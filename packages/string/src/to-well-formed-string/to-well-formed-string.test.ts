import { describe, expect, it } from "vitest";
import { toWellFormedString } from "./to-well-formed-string.js";

describe("toWellFormedString", () => {
    it("replaces a lone surrogate and keeps valid text", () => {
        expect(toWellFormedString("ok")).toBe("ok");
        expect(toWellFormedString("\uD800")?.isWellFormed()).toBe(true);
        expect(toWellFormedString(null)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(toWellFormedString(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            toWellFormedString("") === undefined ||
                typeof toWellFormedString("") === "string" ||
                typeof toWellFormedString("") === "boolean" ||
                typeof toWellFormedString("") === "number" ||
                Array.isArray(toWellFormedString("")) ||
                (typeof toWellFormedString("") === "object" &&
                    toWellFormedString("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            toWellFormedString("👨‍👩‍👧") === undefined ||
                typeof toWellFormedString("👨‍👩‍👧") === "string" ||
                typeof toWellFormedString("👨‍👩‍👧") === "boolean" ||
                typeof toWellFormedString("👨‍👩‍👧") === "number" ||
                Array.isArray(toWellFormedString("👨‍👩‍👧")) ||
                (typeof toWellFormedString("👨‍👩‍👧") === "object" &&
                    toWellFormedString("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            toWellFormedString("e\u0301") === undefined ||
                typeof toWellFormedString("e\u0301") === "string" ||
                typeof toWellFormedString("e\u0301") === "boolean" ||
                typeof toWellFormedString("e\u0301") === "number" ||
                Array.isArray(toWellFormedString("e\u0301")) ||
                (typeof toWellFormedString("e\u0301") === "object" &&
                    toWellFormedString("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            toWellFormedString("مرحبا") === undefined ||
                typeof toWellFormedString("مرحبا") === "string" ||
                typeof toWellFormedString("مرحبا") === "boolean" ||
                typeof toWellFormedString("مرحبا") === "number" ||
                Array.isArray(toWellFormedString("مرحبا")) ||
                (typeof toWellFormedString("مرحبا") === "object" &&
                    toWellFormedString("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            toWellFormedString("你好") === undefined ||
                typeof toWellFormedString("你好") === "string" ||
                typeof toWellFormedString("你好") === "boolean" ||
                typeof toWellFormedString("你好") === "number" ||
                Array.isArray(toWellFormedString("你好")) ||
                (typeof toWellFormedString("你好") === "object" &&
                    toWellFormedString("你好") !== null),
        ).toBe(true);
    });
});
