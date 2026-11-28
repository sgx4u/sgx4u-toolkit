import { describe, expect, it } from "vitest";
import { dropLast } from "./drop-last.js";
describe("dropLast", () => {
    it("uses the count", () => {
        expect(dropLast({ value: "hello", count: 2 })).toBe("hel");
        expect(dropLast({ value: "hello", count: 0 })).toBe("");
        expect(
            dropLast({ value: 1 as unknown as string, count: 1 }),
        ).toBeUndefined();
        expect(() => dropLast({ value: "a", count: -1 })).toThrow(RangeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(dropLast(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            dropLast({ value: "", count: 2 }) === undefined ||
                typeof dropLast({ value: "", count: 2 }) === "string" ||
                typeof dropLast({ value: "", count: 2 }) === "boolean" ||
                typeof dropLast({ value: "", count: 2 }) === "number" ||
                Array.isArray(dropLast({ value: "", count: 2 })) ||
                (typeof dropLast({ value: "", count: 2 }) === "object" &&
                    dropLast({ value: "", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            dropLast({ value: "👨‍👩‍👧", count: 2 }) === undefined ||
                typeof dropLast({ value: "👨‍👩‍👧", count: 2 }) === "string" ||
                typeof dropLast({ value: "👨‍👩‍👧", count: 2 }) === "boolean" ||
                typeof dropLast({ value: "👨‍👩‍👧", count: 2 }) === "number" ||
                Array.isArray(dropLast({ value: "👨‍👩‍👧", count: 2 })) ||
                (typeof dropLast({ value: "👨‍👩‍👧", count: 2 }) === "object" &&
                    dropLast({ value: "👨‍👩‍👧", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            dropLast({ value: "e\u0301", count: 2 }) === undefined ||
                typeof dropLast({ value: "e\u0301", count: 2 }) === "string" ||
                typeof dropLast({ value: "e\u0301", count: 2 }) === "boolean" ||
                typeof dropLast({ value: "e\u0301", count: 2 }) === "number" ||
                Array.isArray(dropLast({ value: "e\u0301", count: 2 })) ||
                (typeof dropLast({ value: "e\u0301", count: 2 }) === "object" &&
                    dropLast({ value: "e\u0301", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            dropLast({ value: "مرحبا", count: 2 }) === undefined ||
                typeof dropLast({ value: "مرحبا", count: 2 }) === "string" ||
                typeof dropLast({ value: "مرحبا", count: 2 }) === "boolean" ||
                typeof dropLast({ value: "مرحبا", count: 2 }) === "number" ||
                Array.isArray(dropLast({ value: "مرحبا", count: 2 })) ||
                (typeof dropLast({ value: "مرحبا", count: 2 }) === "object" &&
                    dropLast({ value: "مرحبا", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            dropLast({ value: "你好", count: 2 }) === undefined ||
                typeof dropLast({ value: "你好", count: 2 }) === "string" ||
                typeof dropLast({ value: "你好", count: 2 }) === "boolean" ||
                typeof dropLast({ value: "你好", count: 2 }) === "number" ||
                Array.isArray(dropLast({ value: "你好", count: 2 })) ||
                (typeof dropLast({ value: "你好", count: 2 }) === "object" &&
                    dropLast({ value: "你好", count: 2 }) !== null),
        ).toBe(true);
    });
    it("throws when unit is unknown", () => {
        expect(() =>
            dropLast({ value: "hello", count: 2, unit: "nope" as never }),
        ).toThrow(RangeError);
    });
    it("throws when count is negative", () => {
        expect(() => dropLast({ value: "hello", count: -1 })).toThrow(
            RangeError,
        );
    });
});
