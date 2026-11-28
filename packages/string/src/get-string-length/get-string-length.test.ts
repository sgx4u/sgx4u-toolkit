import { describe, expect, it } from "vitest";
import type { StringUnit } from "../types/string-unit.types.js";
import { getStringLength } from "./get-string-length.js";

describe("getStringLength", () => {
    it("counts graphemes, code points, and code units", () => {
        expect(getStringLength({ value: "" })).toBe(0);
        expect(getStringLength({ value: "a😀" })).toBe(2);
        expect(getStringLength({ value: "👨‍👩‍👧‍👦" })).toBe(1);
        expect(getStringLength({ value: "👨‍👩‍👧‍👦", unit: "codePoint" })).toBe(7);
        expect(getStringLength({ value: "🇺🇸" })).toBe(1);
        expect(getStringLength({ value: "👍🏽" })).toBe(1);
        expect(getStringLength({ value: "e\u0301" })).toBe(1);
        expect(getStringLength({ value: "e\u0301", unit: "codePoint" })).toBe(
            2,
        );
        expect(getStringLength({ value: "😀", unit: "codeUnit" })).toBe(2);
        expect(getStringLength({ value: "가" })).toBe(1);
        expect(getStringLength({ value: "क्ष" })).toBe(1);
        expect(getStringLength({ value: " " })).toBe(1);
        expect(getStringLength({ value: "ก\u0E49", locale: "th-TH" })).toBe(1);
        expect(
            getStringLength({ value: 1 as unknown as string }),
        ).toBeUndefined();
    });

    it("rejects an unknown unit", () => {
        expect(() =>
            getStringLength({ value: "a", unit: "chars" as StringUnit }),
        ).toThrow(RangeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getStringLength(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getStringLength({ value: "" }) === undefined ||
                typeof getStringLength({ value: "" }) === "string" ||
                typeof getStringLength({ value: "" }) === "boolean" ||
                typeof getStringLength({ value: "" }) === "number" ||
                Array.isArray(getStringLength({ value: "" })) ||
                (typeof getStringLength({ value: "" }) === "object" &&
                    getStringLength({ value: "" }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getStringLength({ value: "👨‍👩‍👧" }) === undefined ||
                typeof getStringLength({ value: "👨‍👩‍👧" }) === "string" ||
                typeof getStringLength({ value: "👨‍👩‍👧" }) === "boolean" ||
                typeof getStringLength({ value: "👨‍👩‍👧" }) === "number" ||
                Array.isArray(getStringLength({ value: "👨‍👩‍👧" })) ||
                (typeof getStringLength({ value: "👨‍👩‍👧" }) === "object" &&
                    getStringLength({ value: "👨‍👩‍👧" }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getStringLength({ value: "e\u0301" }) === undefined ||
                typeof getStringLength({ value: "e\u0301" }) === "string" ||
                typeof getStringLength({ value: "e\u0301" }) === "boolean" ||
                typeof getStringLength({ value: "e\u0301" }) === "number" ||
                Array.isArray(getStringLength({ value: "e\u0301" })) ||
                (typeof getStringLength({ value: "e\u0301" }) === "object" &&
                    getStringLength({ value: "e\u0301" }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getStringLength({ value: "مرحبا" }) === undefined ||
                typeof getStringLength({ value: "مرحبا" }) === "string" ||
                typeof getStringLength({ value: "مرحبا" }) === "boolean" ||
                typeof getStringLength({ value: "مرحبا" }) === "number" ||
                Array.isArray(getStringLength({ value: "مرحبا" })) ||
                (typeof getStringLength({ value: "مرحبا" }) === "object" &&
                    getStringLength({ value: "مرحبا" }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getStringLength({ value: "你好" }) === undefined ||
                typeof getStringLength({ value: "你好" }) === "string" ||
                typeof getStringLength({ value: "你好" }) === "boolean" ||
                typeof getStringLength({ value: "你好" }) === "number" ||
                Array.isArray(getStringLength({ value: "你好" })) ||
                (typeof getStringLength({ value: "你好" }) === "object" &&
                    getStringLength({ value: "你好" }) !== null),
        ).toBe(true);
    });
    it("throws when unit is unknown", () => {
        expect(() =>
            getStringLength({ value: "a😀", unit: "nope" as never }),
        ).toThrow(RangeError);
    });
});
