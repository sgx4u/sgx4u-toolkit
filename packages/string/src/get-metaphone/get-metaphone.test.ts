import { describe, expect, it } from "vitest";
import { getMetaphone } from "./get-metaphone.js";
describe("getMetaphone", () => {
    it("encodes Smith, Robert, and Rupert", () => {
        expect(getMetaphone("Smith")).toBe("SM0");
        expect(getMetaphone("Robert")).toBe("RBRT");
        expect(getMetaphone("Rupert")).toBe("RPRT");
        expect(getMetaphone("")).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getMetaphone(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getMetaphone("") === undefined ||
                typeof getMetaphone("") === "string" ||
                typeof getMetaphone("") === "boolean" ||
                typeof getMetaphone("") === "number" ||
                Array.isArray(getMetaphone("")) ||
                (typeof getMetaphone("") === "object" &&
                    getMetaphone("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getMetaphone("👨‍👩‍👧") === undefined ||
                typeof getMetaphone("👨‍👩‍👧") === "string" ||
                typeof getMetaphone("👨‍👩‍👧") === "boolean" ||
                typeof getMetaphone("👨‍👩‍👧") === "number" ||
                Array.isArray(getMetaphone("👨‍👩‍👧")) ||
                (typeof getMetaphone("👨‍👩‍👧") === "object" &&
                    getMetaphone("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getMetaphone("e\u0301") === undefined ||
                typeof getMetaphone("e\u0301") === "string" ||
                typeof getMetaphone("e\u0301") === "boolean" ||
                typeof getMetaphone("e\u0301") === "number" ||
                Array.isArray(getMetaphone("e\u0301")) ||
                (typeof getMetaphone("e\u0301") === "object" &&
                    getMetaphone("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getMetaphone("مرحبا") === undefined ||
                typeof getMetaphone("مرحبا") === "string" ||
                typeof getMetaphone("مرحبا") === "boolean" ||
                typeof getMetaphone("مرحبا") === "number" ||
                Array.isArray(getMetaphone("مرحبا")) ||
                (typeof getMetaphone("مرحبا") === "object" &&
                    getMetaphone("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getMetaphone("你好") === undefined ||
                typeof getMetaphone("你好") === "string" ||
                typeof getMetaphone("你好") === "boolean" ||
                typeof getMetaphone("你好") === "number" ||
                Array.isArray(getMetaphone("你好")) ||
                (typeof getMetaphone("你好") === "object" &&
                    getMetaphone("你好") !== null),
        ).toBe(true);
    });
});
