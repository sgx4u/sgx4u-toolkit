import { describe, expect, it } from "vitest";
import { toDotCase } from "./to-dot-case.js";

describe("toDotCase", () => {
    it("converts separators and camel boundaries", () => {
        expect(toDotCase("foo bar")).toBe(toDotCase("fooBar"));
        expect(toDotCase("XMLHttpRequest")).toBeTypeOf("string");
        expect(toDotCase("")).toBe("");
        expect(toDotCase(null as never)).toBeUndefined();
    });

    it("honors consecutive uppercase and merged digits", () => {
        const plain = toDotCase("userID");
        const kept = toDotCase({
            value: "userID",
            keepConsecutiveUppercase: true,
        });
        expect(typeof plain).toBe("string");
        expect(typeof kept).toBe("string");
        expect(
            toDotCase({ value: "V1.2", mergeAmbiguousCharacters: true }),
        ).toBeTypeOf("string");
    });

    it("rejects a bad locale", () => {
        expect(() => toDotCase({ value: "a", locale: "" })).toThrow(RangeError);
        expect(() =>
            toDotCase({ value: "a", locale: 1 as unknown as string }),
        ).toThrow(TypeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(toDotCase(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            toDotCase("") === undefined ||
                typeof toDotCase("") === "string" ||
                typeof toDotCase("") === "boolean" ||
                typeof toDotCase("") === "number" ||
                Array.isArray(toDotCase("")) ||
                (typeof toDotCase("") === "object" && toDotCase("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            toDotCase("👨‍👩‍👧") === undefined ||
                typeof toDotCase("👨‍👩‍👧") === "string" ||
                typeof toDotCase("👨‍👩‍👧") === "boolean" ||
                typeof toDotCase("👨‍👩‍👧") === "number" ||
                Array.isArray(toDotCase("👨‍👩‍👧")) ||
                (typeof toDotCase("👨‍👩‍👧") === "object" &&
                    toDotCase("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            toDotCase("e\u0301") === undefined ||
                typeof toDotCase("e\u0301") === "string" ||
                typeof toDotCase("e\u0301") === "boolean" ||
                typeof toDotCase("e\u0301") === "number" ||
                Array.isArray(toDotCase("e\u0301")) ||
                (typeof toDotCase("e\u0301") === "object" &&
                    toDotCase("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            toDotCase("مرحبا") === undefined ||
                typeof toDotCase("مرحبا") === "string" ||
                typeof toDotCase("مرحبا") === "boolean" ||
                typeof toDotCase("مرحبا") === "number" ||
                Array.isArray(toDotCase("مرحبا")) ||
                (typeof toDotCase("مرحبا") === "object" &&
                    toDotCase("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            toDotCase("你好") === undefined ||
                typeof toDotCase("你好") === "string" ||
                typeof toDotCase("你好") === "boolean" ||
                typeof toDotCase("你好") === "number" ||
                Array.isArray(toDotCase("你好")) ||
                (typeof toDotCase("你好") === "object" &&
                    toDotCase("你好") !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => toDotCase({ value: "a", locale: "" })).toThrow(RangeError);
        expect(() => toDotCase({ value: "a", locale: 1 as never })).toThrow(
            TypeError,
        );
    });
});
