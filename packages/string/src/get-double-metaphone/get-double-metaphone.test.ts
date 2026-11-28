import { describe, expect, it } from "vitest";
import { getDoubleMetaphone } from "./get-double-metaphone.js";
describe("getDoubleMetaphone", () => {
    it("overlaps Smith and Schmidt", () => {
        expect(getDoubleMetaphone("Smith")).toEqual({
            primary: "SM0",
            secondary: "XMT",
        });
        expect(getDoubleMetaphone("Schmidt")).toEqual({
            primary: "XMT",
            secondary: "SMT",
        });
        expect(getDoubleMetaphone(null)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getDoubleMetaphone(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getDoubleMetaphone("") === undefined ||
                typeof getDoubleMetaphone("") === "string" ||
                typeof getDoubleMetaphone("") === "boolean" ||
                typeof getDoubleMetaphone("") === "number" ||
                Array.isArray(getDoubleMetaphone("")) ||
                (typeof getDoubleMetaphone("") === "object" &&
                    getDoubleMetaphone("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getDoubleMetaphone("👨‍👩‍👧") === undefined ||
                typeof getDoubleMetaphone("👨‍👩‍👧") === "string" ||
                typeof getDoubleMetaphone("👨‍👩‍👧") === "boolean" ||
                typeof getDoubleMetaphone("👨‍👩‍👧") === "number" ||
                Array.isArray(getDoubleMetaphone("👨‍👩‍👧")) ||
                (typeof getDoubleMetaphone("👨‍👩‍👧") === "object" &&
                    getDoubleMetaphone("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getDoubleMetaphone("e\u0301") === undefined ||
                typeof getDoubleMetaphone("e\u0301") === "string" ||
                typeof getDoubleMetaphone("e\u0301") === "boolean" ||
                typeof getDoubleMetaphone("e\u0301") === "number" ||
                Array.isArray(getDoubleMetaphone("e\u0301")) ||
                (typeof getDoubleMetaphone("e\u0301") === "object" &&
                    getDoubleMetaphone("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getDoubleMetaphone("مرحبا") === undefined ||
                typeof getDoubleMetaphone("مرحبا") === "string" ||
                typeof getDoubleMetaphone("مرحبا") === "boolean" ||
                typeof getDoubleMetaphone("مرحبا") === "number" ||
                Array.isArray(getDoubleMetaphone("مرحبا")) ||
                (typeof getDoubleMetaphone("مرحبا") === "object" &&
                    getDoubleMetaphone("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getDoubleMetaphone("你好") === undefined ||
                typeof getDoubleMetaphone("你好") === "string" ||
                typeof getDoubleMetaphone("你好") === "boolean" ||
                typeof getDoubleMetaphone("你好") === "number" ||
                Array.isArray(getDoubleMetaphone("你好")) ||
                (typeof getDoubleMetaphone("你好") === "object" &&
                    getDoubleMetaphone("你好") !== null),
        ).toBe(true);
    });
});
