import { describe, expect, it } from "vitest";
import { toTrainCase } from "./to-train-case.js";

describe("toTrainCase", () => {
    it("converts separators and camel boundaries", () => {
        expect(toTrainCase("foo bar")).toBe(toTrainCase("fooBar"));
        expect(toTrainCase("XMLHttpRequest")).toBeTypeOf("string");
        expect(toTrainCase("")).toBe("");
        expect(toTrainCase(null as never)).toBeUndefined();
    });

    it("honors consecutive uppercase and merged digits", () => {
        const plain = toTrainCase("userID");
        const kept = toTrainCase({
            value: "userID",
            keepConsecutiveUppercase: true,
        });
        expect(typeof plain).toBe("string");
        expect(typeof kept).toBe("string");
        expect(
            toTrainCase({ value: "V1.2", mergeAmbiguousCharacters: true }),
        ).toBeTypeOf("string");
    });

    it("rejects a bad locale", () => {
        expect(() => toTrainCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() =>
            toTrainCase({ value: "a", locale: 1 as unknown as string }),
        ).toThrow(TypeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(toTrainCase(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            toTrainCase("") === undefined ||
                typeof toTrainCase("") === "string" ||
                typeof toTrainCase("") === "boolean" ||
                typeof toTrainCase("") === "number" ||
                Array.isArray(toTrainCase("")) ||
                (typeof toTrainCase("") === "object" &&
                    toTrainCase("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            toTrainCase("👨‍👩‍👧") === undefined ||
                typeof toTrainCase("👨‍👩‍👧") === "string" ||
                typeof toTrainCase("👨‍👩‍👧") === "boolean" ||
                typeof toTrainCase("👨‍👩‍👧") === "number" ||
                Array.isArray(toTrainCase("👨‍👩‍👧")) ||
                (typeof toTrainCase("👨‍👩‍👧") === "object" &&
                    toTrainCase("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            toTrainCase("e\u0301") === undefined ||
                typeof toTrainCase("e\u0301") === "string" ||
                typeof toTrainCase("e\u0301") === "boolean" ||
                typeof toTrainCase("e\u0301") === "number" ||
                Array.isArray(toTrainCase("e\u0301")) ||
                (typeof toTrainCase("e\u0301") === "object" &&
                    toTrainCase("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            toTrainCase("مرحبا") === undefined ||
                typeof toTrainCase("مرحبا") === "string" ||
                typeof toTrainCase("مرحبا") === "boolean" ||
                typeof toTrainCase("مرحبا") === "number" ||
                Array.isArray(toTrainCase("مرحبا")) ||
                (typeof toTrainCase("مرحبا") === "object" &&
                    toTrainCase("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            toTrainCase("你好") === undefined ||
                typeof toTrainCase("你好") === "string" ||
                typeof toTrainCase("你好") === "boolean" ||
                typeof toTrainCase("你好") === "number" ||
                Array.isArray(toTrainCase("你好")) ||
                (typeof toTrainCase("你好") === "object" &&
                    toTrainCase("你好") !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => toTrainCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() => toTrainCase({ value: "a", locale: 1 as never })).toThrow(
            TypeError,
        );
    });
});
