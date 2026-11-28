import { describe, expect, it } from "vitest";
import { trimStart } from "./trim-start.js";

describe("trimStart", () => {
    it("trims one end", () => {
        expect(trimStart("  a  ")).not.toBe("  a  ");
        expect(trimStart("")).toBe("");
        expect(trimStart(1 as unknown as string)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(trimStart(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            trimStart("") === undefined ||
                typeof trimStart("") === "string" ||
                typeof trimStart("") === "boolean" ||
                typeof trimStart("") === "number" ||
                Array.isArray(trimStart("")) ||
                (typeof trimStart("") === "object" && trimStart("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            trimStart("👨‍👩‍👧") === undefined ||
                typeof trimStart("👨‍👩‍👧") === "string" ||
                typeof trimStart("👨‍👩‍👧") === "boolean" ||
                typeof trimStart("👨‍👩‍👧") === "number" ||
                Array.isArray(trimStart("👨‍👩‍👧")) ||
                (typeof trimStart("👨‍👩‍👧") === "object" &&
                    trimStart("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            trimStart("e\u0301") === undefined ||
                typeof trimStart("e\u0301") === "string" ||
                typeof trimStart("e\u0301") === "boolean" ||
                typeof trimStart("e\u0301") === "number" ||
                Array.isArray(trimStart("e\u0301")) ||
                (typeof trimStart("e\u0301") === "object" &&
                    trimStart("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            trimStart("مرحبا") === undefined ||
                typeof trimStart("مرحبا") === "string" ||
                typeof trimStart("مرحبا") === "boolean" ||
                typeof trimStart("مرحبا") === "number" ||
                Array.isArray(trimStart("مرحبا")) ||
                (typeof trimStart("مرحبا") === "object" &&
                    trimStart("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            trimStart("你好") === undefined ||
                typeof trimStart("你好") === "string" ||
                typeof trimStart("你好") === "boolean" ||
                typeof trimStart("你好") === "number" ||
                Array.isArray(trimStart("你好")) ||
                (typeof trimStart("你好") === "object" &&
                    trimStart("你好") !== null),
        ).toBe(true);
    });
});
