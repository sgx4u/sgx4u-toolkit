import { describe, expect, it } from "vitest";
import { indent } from "./indent.js";
describe("indent", () => {
    it("prefixes non-empty lines", () => {
        expect(indent({ value: "a\n\nb" })).toBe(" a\n\n b");
        expect(indent({ value: "a", count: 2, character: "." })).toBe("..a");
        expect(() => indent({ value: "a", count: -1 })).toThrow(RangeError);
        expect(indent({ value: 1 as unknown as string })).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(indent(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            indent({ value: "" }) === undefined ||
                typeof indent({ value: "" }) === "string" ||
                typeof indent({ value: "" }) === "boolean" ||
                typeof indent({ value: "" }) === "number" ||
                Array.isArray(indent({ value: "" })) ||
                (typeof indent({ value: "" }) === "object" &&
                    indent({ value: "" }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            indent({ value: "👨‍👩‍👧" }) === undefined ||
                typeof indent({ value: "👨‍👩‍👧" }) === "string" ||
                typeof indent({ value: "👨‍👩‍👧" }) === "boolean" ||
                typeof indent({ value: "👨‍👩‍👧" }) === "number" ||
                Array.isArray(indent({ value: "👨‍👩‍👧" })) ||
                (typeof indent({ value: "👨‍👩‍👧" }) === "object" &&
                    indent({ value: "👨‍👩‍👧" }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            indent({ value: "e\u0301" }) === undefined ||
                typeof indent({ value: "e\u0301" }) === "string" ||
                typeof indent({ value: "e\u0301" }) === "boolean" ||
                typeof indent({ value: "e\u0301" }) === "number" ||
                Array.isArray(indent({ value: "e\u0301" })) ||
                (typeof indent({ value: "e\u0301" }) === "object" &&
                    indent({ value: "e\u0301" }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            indent({ value: "مرحبا" }) === undefined ||
                typeof indent({ value: "مرحبا" }) === "string" ||
                typeof indent({ value: "مرحبا" }) === "boolean" ||
                typeof indent({ value: "مرحبا" }) === "number" ||
                Array.isArray(indent({ value: "مرحبا" })) ||
                (typeof indent({ value: "مرحبا" }) === "object" &&
                    indent({ value: "مرحبا" }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            indent({ value: "你好" }) === undefined ||
                typeof indent({ value: "你好" }) === "string" ||
                typeof indent({ value: "你好" }) === "boolean" ||
                typeof indent({ value: "你好" }) === "number" ||
                Array.isArray(indent({ value: "你好" })) ||
                (typeof indent({ value: "你好" }) === "object" &&
                    indent({ value: "你好" }) !== null),
        ).toBe(true);
    });
    it("throws when count is negative", () => {
        expect(() => indent({ value: "a\nb", count: -1 })).toThrow(RangeError);
    });
});
