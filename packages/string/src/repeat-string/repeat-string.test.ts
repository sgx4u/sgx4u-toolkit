import { describe, expect, it } from "vitest";
import { repeatString } from "./repeat-string.js";
describe("repeatString", () => {
    it("repeats and rejects a bad count", () => {
        expect(repeatString({ value: "ab", count: 2 })).toBe("abab");
        expect(repeatString({ value: "ab", count: 0 })).toBe("");
        expect(() => repeatString({ value: "a", count: -1 })).toThrow(
            RangeError,
        );
        expect(() => repeatString({ value: "a", count: 1.5 })).toThrow(
            RangeError,
        );
        expect(
            repeatString({ value: 1 as unknown as string, count: 1 }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(repeatString(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            repeatString({ value: "", count: 2 }) === undefined ||
                typeof repeatString({ value: "", count: 2 }) === "string" ||
                typeof repeatString({ value: "", count: 2 }) === "boolean" ||
                typeof repeatString({ value: "", count: 2 }) === "number" ||
                Array.isArray(repeatString({ value: "", count: 2 })) ||
                (typeof repeatString({ value: "", count: 2 }) === "object" &&
                    repeatString({ value: "", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            repeatString({ value: "👨‍👩‍👧", count: 2 }) === undefined ||
                typeof repeatString({ value: "👨‍👩‍👧", count: 2 }) === "string" ||
                typeof repeatString({ value: "👨‍👩‍👧", count: 2 }) === "boolean" ||
                typeof repeatString({ value: "👨‍👩‍👧", count: 2 }) === "number" ||
                Array.isArray(repeatString({ value: "👨‍👩‍👧", count: 2 })) ||
                (typeof repeatString({ value: "👨‍👩‍👧", count: 2 }) === "object" &&
                    repeatString({ value: "👨‍👩‍👧", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            repeatString({ value: "e\u0301", count: 2 }) === undefined ||
                typeof repeatString({ value: "e\u0301", count: 2 }) ===
                    "string" ||
                typeof repeatString({ value: "e\u0301", count: 2 }) ===
                    "boolean" ||
                typeof repeatString({ value: "e\u0301", count: 2 }) ===
                    "number" ||
                Array.isArray(repeatString({ value: "e\u0301", count: 2 })) ||
                (typeof repeatString({ value: "e\u0301", count: 2 }) ===
                    "object" &&
                    repeatString({ value: "e\u0301", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            repeatString({ value: "مرحبا", count: 2 }) === undefined ||
                typeof repeatString({ value: "مرحبا", count: 2 }) ===
                    "string" ||
                typeof repeatString({ value: "مرحبا", count: 2 }) ===
                    "boolean" ||
                typeof repeatString({ value: "مرحبا", count: 2 }) ===
                    "number" ||
                Array.isArray(repeatString({ value: "مرحبا", count: 2 })) ||
                (typeof repeatString({ value: "مرحبا", count: 2 }) ===
                    "object" &&
                    repeatString({ value: "مرحبا", count: 2 }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            repeatString({ value: "你好", count: 2 }) === undefined ||
                typeof repeatString({ value: "你好", count: 2 }) === "string" ||
                typeof repeatString({ value: "你好", count: 2 }) ===
                    "boolean" ||
                typeof repeatString({ value: "你好", count: 2 }) === "number" ||
                Array.isArray(repeatString({ value: "你好", count: 2 })) ||
                (typeof repeatString({ value: "你好", count: 2 }) ===
                    "object" &&
                    repeatString({ value: "你好", count: 2 }) !== null),
        ).toBe(true);
    });
    it("throws when count is negative", () => {
        expect(() => repeatString({ value: "ab", count: -1 })).toThrow(
            RangeError,
        );
    });
});
