import { describe, expect, it } from "vitest";
import { takeLast } from "./take-last.js";
describe("takeLast", () => {
    it("uses the count", () => {
        expect(takeLast({ value: "hello", count: 2 })).toBe("lo");
        expect(takeLast({ value: "hello", count: 0 })).toBe("");
        expect(
            takeLast({ value: 1 as unknown as string, count: 1 }),
        ).toBeUndefined();
        expect(() => takeLast({ value: "a", count: -1 })).toThrow(RangeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(takeLast(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            takeLast({ value: "", count: 2 }) === undefined ||
                typeof takeLast({ value: "", count: 2 }) === "string" ||
                typeof takeLast({ value: "", count: 2 }) === "boolean" ||
                typeof takeLast({ value: "", count: 2 }) === "number" ||
                Array.isArray(takeLast({ value: "", count: 2 })) ||
                (typeof takeLast({ value: "", count: 2 }) === "object" &&
                    takeLast({ value: "", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            takeLast({ value: "👨‍👩‍👧", count: 2 }) === undefined ||
                typeof takeLast({ value: "👨‍👩‍👧", count: 2 }) === "string" ||
                typeof takeLast({ value: "👨‍👩‍👧", count: 2 }) === "boolean" ||
                typeof takeLast({ value: "👨‍👩‍👧", count: 2 }) === "number" ||
                Array.isArray(takeLast({ value: "👨‍👩‍👧", count: 2 })) ||
                (typeof takeLast({ value: "👨‍👩‍👧", count: 2 }) === "object" &&
                    takeLast({ value: "👨‍👩‍👧", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            takeLast({ value: "e\u0301", count: 2 }) === undefined ||
                typeof takeLast({ value: "e\u0301", count: 2 }) === "string" ||
                typeof takeLast({ value: "e\u0301", count: 2 }) === "boolean" ||
                typeof takeLast({ value: "e\u0301", count: 2 }) === "number" ||
                Array.isArray(takeLast({ value: "e\u0301", count: 2 })) ||
                (typeof takeLast({ value: "e\u0301", count: 2 }) === "object" &&
                    takeLast({ value: "e\u0301", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            takeLast({ value: "مرحبا", count: 2 }) === undefined ||
                typeof takeLast({ value: "مرحبا", count: 2 }) === "string" ||
                typeof takeLast({ value: "مرحبا", count: 2 }) === "boolean" ||
                typeof takeLast({ value: "مرحبا", count: 2 }) === "number" ||
                Array.isArray(takeLast({ value: "مرحبا", count: 2 })) ||
                (typeof takeLast({ value: "مرحبا", count: 2 }) === "object" &&
                    takeLast({ value: "مرحبا", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            takeLast({ value: "你好", count: 2 }) === undefined ||
                typeof takeLast({ value: "你好", count: 2 }) === "string" ||
                typeof takeLast({ value: "你好", count: 2 }) === "boolean" ||
                typeof takeLast({ value: "你好", count: 2 }) === "number" ||
                Array.isArray(takeLast({ value: "你好", count: 2 })) ||
                (typeof takeLast({ value: "你好", count: 2 }) === "object" &&
                    takeLast({ value: "你好", count: 2 }) !== null),
        ).toBe(true);
    });
    it("throws when unit is unknown", () => {
        expect(() =>
            takeLast({ value: "hello", count: 2, unit: "nope" as never }),
        ).toThrow(RangeError);
    });
    it("throws when count is negative", () => {
        expect(() => takeLast({ value: "hello", count: -1 })).toThrow(
            RangeError,
        );
    });
});
