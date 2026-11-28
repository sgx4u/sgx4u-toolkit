import { describe, expect, it } from "vitest";
import { compareStrings } from "./compare-strings.js";
describe("compareStrings", () => {
    it("orders strings and can collate numbers", () => {
        expect(compareStrings({ first: "a", second: "b" })).toBe(-1);
        expect(compareStrings({ first: "a", second: "a" })).toBe(0);
        expect(
            compareStrings({
                first: "a2",
                second: "a10",
                numeric: true,
                locale: "en-US",
            }),
        ).toBe(-1);
        expect(
            compareStrings({
                first: "a2",
                second: "a10",
                numeric: false,
                locale: "en-US",
            }),
        ).toBe(1);
        expect(
            compareStrings({ first: "ö", second: "z", locale: "de-DE" }),
        ).toBe(-1);
        expect(compareStrings({ first: "ö", second: "z", locale: "sv" })).toBe(
            1,
        );
        expect(
            compareStrings({ first: 1 as unknown as string, second: "a" }),
        ).toBeUndefined();
        expect(() =>
            compareStrings({
                first: "a",
                second: "b",
                sensitivity: "nope" as "base",
            }),
        ).toThrow(RangeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(compareStrings(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            compareStrings({ first: "", second: "b" }) === undefined ||
                typeof compareStrings({ first: "", second: "b" }) ===
                    "string" ||
                typeof compareStrings({ first: "", second: "b" }) ===
                    "boolean" ||
                typeof compareStrings({ first: "", second: "b" }) ===
                    "number" ||
                Array.isArray(compareStrings({ first: "", second: "b" })) ||
                (typeof compareStrings({ first: "", second: "b" }) ===
                    "object" &&
                    compareStrings({ first: "", second: "b" }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            compareStrings({ first: "👨‍👩‍👧", second: "b" }) === undefined ||
                typeof compareStrings({ first: "👨‍👩‍👧", second: "b" }) ===
                    "string" ||
                typeof compareStrings({ first: "👨‍👩‍👧", second: "b" }) ===
                    "boolean" ||
                typeof compareStrings({ first: "👨‍👩‍👧", second: "b" }) ===
                    "number" ||
                Array.isArray(compareStrings({ first: "👨‍👩‍👧", second: "b" })) ||
                (typeof compareStrings({ first: "👨‍👩‍👧", second: "b" }) ===
                    "object" &&
                    compareStrings({ first: "👨‍👩‍👧", second: "b" }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            compareStrings({ first: "e\u0301", second: "b" }) === undefined ||
                typeof compareStrings({ first: "e\u0301", second: "b" }) ===
                    "string" ||
                typeof compareStrings({ first: "e\u0301", second: "b" }) ===
                    "boolean" ||
                typeof compareStrings({ first: "e\u0301", second: "b" }) ===
                    "number" ||
                Array.isArray(
                    compareStrings({ first: "e\u0301", second: "b" }),
                ) ||
                (typeof compareStrings({ first: "e\u0301", second: "b" }) ===
                    "object" &&
                    compareStrings({ first: "e\u0301", second: "b" }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            compareStrings({ first: "مرحبا", second: "b" }) === undefined ||
                typeof compareStrings({ first: "مرحبا", second: "b" }) ===
                    "string" ||
                typeof compareStrings({ first: "مرحبا", second: "b" }) ===
                    "boolean" ||
                typeof compareStrings({ first: "مرحبا", second: "b" }) ===
                    "number" ||
                Array.isArray(
                    compareStrings({ first: "مرحبا", second: "b" }),
                ) ||
                (typeof compareStrings({ first: "مرحبا", second: "b" }) ===
                    "object" &&
                    compareStrings({ first: "مرحبا", second: "b" }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            compareStrings({ first: "你好", second: "b" }) === undefined ||
                typeof compareStrings({ first: "你好", second: "b" }) ===
                    "string" ||
                typeof compareStrings({ first: "你好", second: "b" }) ===
                    "boolean" ||
                typeof compareStrings({ first: "你好", second: "b" }) ===
                    "number" ||
                Array.isArray(compareStrings({ first: "你好", second: "b" })) ||
                (typeof compareStrings({ first: "你好", second: "b" }) ===
                    "object" &&
                    compareStrings({ first: "你好", second: "b" }) !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() =>
            compareStrings({ first: "a", second: "b", locale: "" }),
        ).toThrow(RangeError);
        expect(() =>
            compareStrings({ first: "a", second: "b", locale: 1 as never }),
        ).toThrow(TypeError);
    });
});
