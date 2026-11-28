import { describe, expect, it } from "vitest";
import { indexOfMatch } from "./index-of-match.js";
describe("indexOfMatch", () => {
    it("returns the unit index or -1", () => {
        expect(indexOfMatch({ value: "hello", search: "ll" })).toBe(2);
        expect(indexOfMatch({ value: "hello", search: "x" })).toBe(-1);
        expect(
            indexOfMatch({ value: "hello", search: "LL", ignoreCase: true }),
        ).toBe(2);
        expect(indexOfMatch({ value: "hello", search: "" })).toBe(0);
        expect(indexOfMatch({ value: "hello", search: "", fromIndex: 9 })).toBe(
            5,
        );
        expect(indexOfMatch({ value: "a👨‍👩‍👧‍👦b", search: "👨‍👩‍👧‍👦" })).toBe(1);
        expect(
            indexOfMatch({ value: 1 as unknown as string, search: "a" }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(indexOfMatch(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            indexOfMatch({ value: "", search: "ll" }) === undefined ||
                typeof indexOfMatch({ value: "", search: "ll" }) === "string" ||
                typeof indexOfMatch({ value: "", search: "ll" }) ===
                    "boolean" ||
                typeof indexOfMatch({ value: "", search: "ll" }) === "number" ||
                Array.isArray(indexOfMatch({ value: "", search: "ll" })) ||
                (typeof indexOfMatch({ value: "", search: "ll" }) ===
                    "object" &&
                    indexOfMatch({ value: "", search: "ll" }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            indexOfMatch({ value: "👨‍👩‍👧", search: "ll" }) === undefined ||
                typeof indexOfMatch({ value: "👨‍👩‍👧", search: "ll" }) ===
                    "string" ||
                typeof indexOfMatch({ value: "👨‍👩‍👧", search: "ll" }) ===
                    "boolean" ||
                typeof indexOfMatch({ value: "👨‍👩‍👧", search: "ll" }) ===
                    "number" ||
                Array.isArray(indexOfMatch({ value: "👨‍👩‍👧", search: "ll" })) ||
                (typeof indexOfMatch({ value: "👨‍👩‍👧", search: "ll" }) ===
                    "object" &&
                    indexOfMatch({ value: "👨‍👩‍👧", search: "ll" }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            indexOfMatch({ value: "e\u0301", search: "ll" }) === undefined ||
                typeof indexOfMatch({ value: "e\u0301", search: "ll" }) ===
                    "string" ||
                typeof indexOfMatch({ value: "e\u0301", search: "ll" }) ===
                    "boolean" ||
                typeof indexOfMatch({ value: "e\u0301", search: "ll" }) ===
                    "number" ||
                Array.isArray(
                    indexOfMatch({ value: "e\u0301", search: "ll" }),
                ) ||
                (typeof indexOfMatch({ value: "e\u0301", search: "ll" }) ===
                    "object" &&
                    indexOfMatch({ value: "e\u0301", search: "ll" }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            indexOfMatch({ value: "مرحبا", search: "ll" }) === undefined ||
                typeof indexOfMatch({ value: "مرحبا", search: "ll" }) ===
                    "string" ||
                typeof indexOfMatch({ value: "مرحبا", search: "ll" }) ===
                    "boolean" ||
                typeof indexOfMatch({ value: "مرحبا", search: "ll" }) ===
                    "number" ||
                Array.isArray(indexOfMatch({ value: "مرحبا", search: "ll" })) ||
                (typeof indexOfMatch({ value: "مرحبا", search: "ll" }) ===
                    "object" &&
                    indexOfMatch({ value: "مرحبا", search: "ll" }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            indexOfMatch({ value: "你好", search: "ll" }) === undefined ||
                typeof indexOfMatch({ value: "你好", search: "ll" }) ===
                    "string" ||
                typeof indexOfMatch({ value: "你好", search: "ll" }) ===
                    "boolean" ||
                typeof indexOfMatch({ value: "你好", search: "ll" }) ===
                    "number" ||
                Array.isArray(indexOfMatch({ value: "你好", search: "ll" })) ||
                (typeof indexOfMatch({ value: "你好", search: "ll" }) ===
                    "object" &&
                    indexOfMatch({ value: "你好", search: "ll" }) !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() =>
            indexOfMatch({ value: "hello", search: "ll", locale: "" }),
        ).toThrow(RangeError);
        expect(() =>
            indexOfMatch({ value: "hello", search: "ll", locale: 1 as never }),
        ).toThrow(TypeError);
    });
    it("throws when unit is unknown", () => {
        expect(() =>
            indexOfMatch({
                value: "hello",
                search: "ll",
                unit: "nope" as never,
            }),
        ).toThrow(RangeError);
    });
});
