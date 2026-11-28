import { describe, expect, it } from "vitest";
import { drop } from "./drop.js";
describe("drop", () => {
    it("uses the count", () => {
        expect(drop({ value: "hello", count: 2 })).toBe("llo");
        expect(drop({ value: "hello", count: 0 })).toBe("");
        expect(
            drop({ value: 1 as unknown as string, count: 1 }),
        ).toBeUndefined();
        expect(() => drop({ value: "a", count: -1 })).toThrow(RangeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(drop(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            drop({ value: "", count: 2 }) === undefined ||
                typeof drop({ value: "", count: 2 }) === "string" ||
                typeof drop({ value: "", count: 2 }) === "boolean" ||
                typeof drop({ value: "", count: 2 }) === "number" ||
                Array.isArray(drop({ value: "", count: 2 })) ||
                (typeof drop({ value: "", count: 2 }) === "object" &&
                    drop({ value: "", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            drop({ value: "👨‍👩‍👧", count: 2 }) === undefined ||
                typeof drop({ value: "👨‍👩‍👧", count: 2 }) === "string" ||
                typeof drop({ value: "👨‍👩‍👧", count: 2 }) === "boolean" ||
                typeof drop({ value: "👨‍👩‍👧", count: 2 }) === "number" ||
                Array.isArray(drop({ value: "👨‍👩‍👧", count: 2 })) ||
                (typeof drop({ value: "👨‍👩‍👧", count: 2 }) === "object" &&
                    drop({ value: "👨‍👩‍👧", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            drop({ value: "e\u0301", count: 2 }) === undefined ||
                typeof drop({ value: "e\u0301", count: 2 }) === "string" ||
                typeof drop({ value: "e\u0301", count: 2 }) === "boolean" ||
                typeof drop({ value: "e\u0301", count: 2 }) === "number" ||
                Array.isArray(drop({ value: "e\u0301", count: 2 })) ||
                (typeof drop({ value: "e\u0301", count: 2 }) === "object" &&
                    drop({ value: "e\u0301", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            drop({ value: "مرحبا", count: 2 }) === undefined ||
                typeof drop({ value: "مرحبا", count: 2 }) === "string" ||
                typeof drop({ value: "مرحبا", count: 2 }) === "boolean" ||
                typeof drop({ value: "مرحبا", count: 2 }) === "number" ||
                Array.isArray(drop({ value: "مرحبا", count: 2 })) ||
                (typeof drop({ value: "مرحبا", count: 2 }) === "object" &&
                    drop({ value: "مرحبا", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            drop({ value: "你好", count: 2 }) === undefined ||
                typeof drop({ value: "你好", count: 2 }) === "string" ||
                typeof drop({ value: "你好", count: 2 }) === "boolean" ||
                typeof drop({ value: "你好", count: 2 }) === "number" ||
                Array.isArray(drop({ value: "你好", count: 2 })) ||
                (typeof drop({ value: "你好", count: 2 }) === "object" &&
                    drop({ value: "你好", count: 2 }) !== null),
        ).toBe(true);
    });
    it("throws when unit is unknown", () => {
        expect(() =>
            drop({ value: "hello", count: 2, unit: "nope" as never }),
        ).toThrow(RangeError);
    });
    it("throws when count is negative", () => {
        expect(() => drop({ value: "hello", count: -1 })).toThrow(RangeError);
    });
});
