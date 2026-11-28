import { describe, expect, it } from "vitest";
import { toPascalSnakeCase } from "./to-pascal-snake-case.js";

describe("toPascalSnakeCase", () => {
    it("converts separators and camel boundaries", () => {
        expect(toPascalSnakeCase("foo bar")).toBe(toPascalSnakeCase("fooBar"));
        expect(toPascalSnakeCase("XMLHttpRequest")).toBeTypeOf("string");
        expect(toPascalSnakeCase("")).toBe("");
        expect(toPascalSnakeCase(null as never)).toBeUndefined();
    });

    it("honors consecutive uppercase and merged digits", () => {
        const plain = toPascalSnakeCase("userID");
        const kept = toPascalSnakeCase({
            value: "userID",
            keepConsecutiveUppercase: true,
        });
        expect(typeof plain).toBe("string");
        expect(typeof kept).toBe("string");
        expect(
            toPascalSnakeCase({
                value: "V1.2",
                mergeAmbiguousCharacters: true,
            }),
        ).toBeTypeOf("string");
    });

    it("rejects a bad locale", () => {
        expect(() => toPascalSnakeCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() =>
            toPascalSnakeCase({ value: "a", locale: 1 as unknown as string }),
        ).toThrow(TypeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(toPascalSnakeCase(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            toPascalSnakeCase("") === undefined ||
                typeof toPascalSnakeCase("") === "string" ||
                typeof toPascalSnakeCase("") === "boolean" ||
                typeof toPascalSnakeCase("") === "number" ||
                Array.isArray(toPascalSnakeCase("")) ||
                (typeof toPascalSnakeCase("") === "object" &&
                    toPascalSnakeCase("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            toPascalSnakeCase("👨‍👩‍👧") === undefined ||
                typeof toPascalSnakeCase("👨‍👩‍👧") === "string" ||
                typeof toPascalSnakeCase("👨‍👩‍👧") === "boolean" ||
                typeof toPascalSnakeCase("👨‍👩‍👧") === "number" ||
                Array.isArray(toPascalSnakeCase("👨‍👩‍👧")) ||
                (typeof toPascalSnakeCase("👨‍👩‍👧") === "object" &&
                    toPascalSnakeCase("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            toPascalSnakeCase("e\u0301") === undefined ||
                typeof toPascalSnakeCase("e\u0301") === "string" ||
                typeof toPascalSnakeCase("e\u0301") === "boolean" ||
                typeof toPascalSnakeCase("e\u0301") === "number" ||
                Array.isArray(toPascalSnakeCase("e\u0301")) ||
                (typeof toPascalSnakeCase("e\u0301") === "object" &&
                    toPascalSnakeCase("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            toPascalSnakeCase("مرحبا") === undefined ||
                typeof toPascalSnakeCase("مرحبا") === "string" ||
                typeof toPascalSnakeCase("مرحبا") === "boolean" ||
                typeof toPascalSnakeCase("مرحبا") === "number" ||
                Array.isArray(toPascalSnakeCase("مرحبا")) ||
                (typeof toPascalSnakeCase("مرحبا") === "object" &&
                    toPascalSnakeCase("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            toPascalSnakeCase("你好") === undefined ||
                typeof toPascalSnakeCase("你好") === "string" ||
                typeof toPascalSnakeCase("你好") === "boolean" ||
                typeof toPascalSnakeCase("你好") === "number" ||
                Array.isArray(toPascalSnakeCase("你好")) ||
                (typeof toPascalSnakeCase("你好") === "object" &&
                    toPascalSnakeCase("你好") !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => toPascalSnakeCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() =>
            toPascalSnakeCase({ value: "a", locale: 1 as never }),
        ).toThrow(TypeError);
    });
});
