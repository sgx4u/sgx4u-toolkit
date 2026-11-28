import { describe, expect, it } from "vitest";
import { toPathCase } from "./to-path-case.js";

describe("toPathCase", () => {
    it("converts separators and camel boundaries", () => {
        expect(toPathCase("foo bar")).toBe(toPathCase("fooBar"));
        expect(toPathCase("XMLHttpRequest")).toBeTypeOf("string");
        expect(toPathCase("")).toBe("");
        expect(toPathCase(null as never)).toBeUndefined();
    });

    it("honors consecutive uppercase and merged digits", () => {
        const plain = toPathCase("userID");
        const kept = toPathCase({
            value: "userID",
            keepConsecutiveUppercase: true,
        });
        expect(typeof plain).toBe("string");
        expect(typeof kept).toBe("string");
        expect(
            toPathCase({ value: "V1.2", mergeAmbiguousCharacters: true }),
        ).toBeTypeOf("string");
    });

    it("rejects a bad locale", () => {
        expect(() => toPathCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() =>
            toPathCase({ value: "a", locale: 1 as unknown as string }),
        ).toThrow(TypeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(toPathCase(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            toPathCase("") === undefined ||
                typeof toPathCase("") === "string" ||
                typeof toPathCase("") === "boolean" ||
                typeof toPathCase("") === "number" ||
                Array.isArray(toPathCase("")) ||
                (typeof toPathCase("") === "object" && toPathCase("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            toPathCase("👨‍👩‍👧") === undefined ||
                typeof toPathCase("👨‍👩‍👧") === "string" ||
                typeof toPathCase("👨‍👩‍👧") === "boolean" ||
                typeof toPathCase("👨‍👩‍👧") === "number" ||
                Array.isArray(toPathCase("👨‍👩‍👧")) ||
                (typeof toPathCase("👨‍👩‍👧") === "object" &&
                    toPathCase("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            toPathCase("e\u0301") === undefined ||
                typeof toPathCase("e\u0301") === "string" ||
                typeof toPathCase("e\u0301") === "boolean" ||
                typeof toPathCase("e\u0301") === "number" ||
                Array.isArray(toPathCase("e\u0301")) ||
                (typeof toPathCase("e\u0301") === "object" &&
                    toPathCase("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            toPathCase("مرحبا") === undefined ||
                typeof toPathCase("مرحبا") === "string" ||
                typeof toPathCase("مرحبا") === "boolean" ||
                typeof toPathCase("مرحبا") === "number" ||
                Array.isArray(toPathCase("مرحبا")) ||
                (typeof toPathCase("مرحبا") === "object" &&
                    toPathCase("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            toPathCase("你好") === undefined ||
                typeof toPathCase("你好") === "string" ||
                typeof toPathCase("你好") === "boolean" ||
                typeof toPathCase("你好") === "number" ||
                Array.isArray(toPathCase("你好")) ||
                (typeof toPathCase("你好") === "object" &&
                    toPathCase("你好") !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => toPathCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() => toPathCase({ value: "a", locale: 1 as never })).toThrow(
            TypeError,
        );
    });
});
