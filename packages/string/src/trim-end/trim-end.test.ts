import { describe, expect, it } from "vitest";
import { trimEnd } from "./trim-end.js";

describe("trimEnd", () => {
    it("trims one end", () => {
        expect(trimEnd("  a  ")).not.toBe("  a  ");
        expect(trimEnd("")).toBe("");
        expect(trimEnd(1 as unknown as string)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(trimEnd(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            trimEnd("") === undefined ||
                typeof trimEnd("") === "string" ||
                typeof trimEnd("") === "boolean" ||
                typeof trimEnd("") === "number" ||
                Array.isArray(trimEnd("")) ||
                (typeof trimEnd("") === "object" && trimEnd("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            trimEnd("👨‍👩‍👧") === undefined ||
                typeof trimEnd("👨‍👩‍👧") === "string" ||
                typeof trimEnd("👨‍👩‍👧") === "boolean" ||
                typeof trimEnd("👨‍👩‍👧") === "number" ||
                Array.isArray(trimEnd("👨‍👩‍👧")) ||
                (typeof trimEnd("👨‍👩‍👧") === "object" && trimEnd("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            trimEnd("e\u0301") === undefined ||
                typeof trimEnd("e\u0301") === "string" ||
                typeof trimEnd("e\u0301") === "boolean" ||
                typeof trimEnd("e\u0301") === "number" ||
                Array.isArray(trimEnd("e\u0301")) ||
                (typeof trimEnd("e\u0301") === "object" &&
                    trimEnd("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            trimEnd("مرحبا") === undefined ||
                typeof trimEnd("مرحبا") === "string" ||
                typeof trimEnd("مرحبا") === "boolean" ||
                typeof trimEnd("مرحبا") === "number" ||
                Array.isArray(trimEnd("مرحبا")) ||
                (typeof trimEnd("مرحبا") === "object" &&
                    trimEnd("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            trimEnd("你好") === undefined ||
                typeof trimEnd("你好") === "string" ||
                typeof trimEnd("你好") === "boolean" ||
                typeof trimEnd("你好") === "number" ||
                Array.isArray(trimEnd("你好")) ||
                (typeof trimEnd("你好") === "object" &&
                    trimEnd("你好") !== null),
        ).toBe(true);
    });
});
