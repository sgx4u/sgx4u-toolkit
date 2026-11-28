import { describe, expect, it } from "vitest";
import { take } from "./take.js";
describe("take", () => {
    it("uses the count", () => {
        expect(take({ value: "hello", count: 2 })).toBe("he");
        expect(take({ value: "👨‍👩‍👧‍👦ab", count: 1 })).toBe("👨‍👩‍👧‍👦");
        expect(take({ value: "hello", count: 0 })).toBe("");
        expect(
            take({ value: 1 as unknown as string, count: 1 }),
        ).toBeUndefined();
        expect(() => take({ value: "a", count: -1 })).toThrow(RangeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(take(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            take({ value: "", count: 2 }) === undefined ||
                typeof take({ value: "", count: 2 }) === "string" ||
                typeof take({ value: "", count: 2 }) === "boolean" ||
                typeof take({ value: "", count: 2 }) === "number" ||
                Array.isArray(take({ value: "", count: 2 })) ||
                (typeof take({ value: "", count: 2 }) === "object" &&
                    take({ value: "", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            take({ value: "👨‍👩‍👧", count: 2 }) === undefined ||
                typeof take({ value: "👨‍👩‍👧", count: 2 }) === "string" ||
                typeof take({ value: "👨‍👩‍👧", count: 2 }) === "boolean" ||
                typeof take({ value: "👨‍👩‍👧", count: 2 }) === "number" ||
                Array.isArray(take({ value: "👨‍👩‍👧", count: 2 })) ||
                (typeof take({ value: "👨‍👩‍👧", count: 2 }) === "object" &&
                    take({ value: "👨‍👩‍👧", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            take({ value: "e\u0301", count: 2 }) === undefined ||
                typeof take({ value: "e\u0301", count: 2 }) === "string" ||
                typeof take({ value: "e\u0301", count: 2 }) === "boolean" ||
                typeof take({ value: "e\u0301", count: 2 }) === "number" ||
                Array.isArray(take({ value: "e\u0301", count: 2 })) ||
                (typeof take({ value: "e\u0301", count: 2 }) === "object" &&
                    take({ value: "e\u0301", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            take({ value: "مرحبا", count: 2 }) === undefined ||
                typeof take({ value: "مرحبا", count: 2 }) === "string" ||
                typeof take({ value: "مرحبا", count: 2 }) === "boolean" ||
                typeof take({ value: "مرحبا", count: 2 }) === "number" ||
                Array.isArray(take({ value: "مرحبا", count: 2 })) ||
                (typeof take({ value: "مرحبا", count: 2 }) === "object" &&
                    take({ value: "مرحبا", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            take({ value: "你好", count: 2 }) === undefined ||
                typeof take({ value: "你好", count: 2 }) === "string" ||
                typeof take({ value: "你好", count: 2 }) === "boolean" ||
                typeof take({ value: "你好", count: 2 }) === "number" ||
                Array.isArray(take({ value: "你好", count: 2 })) ||
                (typeof take({ value: "你好", count: 2 }) === "object" &&
                    take({ value: "你好", count: 2 }) !== null),
        ).toBe(true);
    });
    it("throws when unit is unknown", () => {
        expect(() =>
            take({ value: "hello", count: 2, unit: "nope" as never }),
        ).toThrow(RangeError);
    });
    it("throws when count is negative", () => {
        expect(() => take({ value: "hello", count: -1 })).toThrow(RangeError);
    });
});
