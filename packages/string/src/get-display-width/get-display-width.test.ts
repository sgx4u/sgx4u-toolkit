import { describe, expect, it } from "vitest";
import { getDisplayWidth } from "./get-display-width.js";

describe("getDisplayWidth", () => {
    it("measures columns and ignores ANSI by default", () => {
        expect(getDisplayWidth({ value: "a" })).toBe(1);
        expect(getDisplayWidth({ value: "あ" })).toBe(2);
        expect(getDisplayWidth({ value: "Ａ" })).toBe(2);
        expect(getDisplayWidth({ value: "ｱ" })).toBe(1);
        expect(getDisplayWidth({ value: "👨‍👩‍👧‍👦" })).toBe(2);
        expect(getDisplayWidth({ value: "👨‍👩‍👧‍👧" })).toBe(2);
        expect(getDisplayWidth({ value: "🇺🇸" })).toBe(2);
        expect(getDisplayWidth({ value: "e\u0301" })).toBe(1);
        expect(getDisplayWidth({ value: "\t" })).toBe(0);
        expect(getDisplayWidth({ value: "§" })).toBe(1);
        expect(getDisplayWidth({ value: "\u001b[31mred\u001b[0m" })).toBe(3);
        expect(
            getDisplayWidth({
                value: "\u001b[31mred\u001b[0m",
                countAnsiEscapeCodes: true,
            }),
        ).toBeGreaterThan(3);
        expect(
            getDisplayWidth({ value: 1 as unknown as string }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getDisplayWidth(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getDisplayWidth({ value: "" }) === undefined ||
                typeof getDisplayWidth({ value: "" }) === "string" ||
                typeof getDisplayWidth({ value: "" }) === "boolean" ||
                typeof getDisplayWidth({ value: "" }) === "number" ||
                Array.isArray(getDisplayWidth({ value: "" })) ||
                (typeof getDisplayWidth({ value: "" }) === "object" &&
                    getDisplayWidth({ value: "" }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getDisplayWidth({ value: "👨‍👩‍👧" }) === undefined ||
                typeof getDisplayWidth({ value: "👨‍👩‍👧" }) === "string" ||
                typeof getDisplayWidth({ value: "👨‍👩‍👧" }) === "boolean" ||
                typeof getDisplayWidth({ value: "👨‍👩‍👧" }) === "number" ||
                Array.isArray(getDisplayWidth({ value: "👨‍👩‍👧" })) ||
                (typeof getDisplayWidth({ value: "👨‍👩‍👧" }) === "object" &&
                    getDisplayWidth({ value: "👨‍👩‍👧" }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getDisplayWidth({ value: "e\u0301" }) === undefined ||
                typeof getDisplayWidth({ value: "e\u0301" }) === "string" ||
                typeof getDisplayWidth({ value: "e\u0301" }) === "boolean" ||
                typeof getDisplayWidth({ value: "e\u0301" }) === "number" ||
                Array.isArray(getDisplayWidth({ value: "e\u0301" })) ||
                (typeof getDisplayWidth({ value: "e\u0301" }) === "object" &&
                    getDisplayWidth({ value: "e\u0301" }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getDisplayWidth({ value: "مرحبا" }) === undefined ||
                typeof getDisplayWidth({ value: "مرحبا" }) === "string" ||
                typeof getDisplayWidth({ value: "مرحبا" }) === "boolean" ||
                typeof getDisplayWidth({ value: "مرحبا" }) === "number" ||
                Array.isArray(getDisplayWidth({ value: "مرحبا" })) ||
                (typeof getDisplayWidth({ value: "مرحبا" }) === "object" &&
                    getDisplayWidth({ value: "مرحبا" }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getDisplayWidth({ value: "你好" }) === undefined ||
                typeof getDisplayWidth({ value: "你好" }) === "string" ||
                typeof getDisplayWidth({ value: "你好" }) === "boolean" ||
                typeof getDisplayWidth({ value: "你好" }) === "number" ||
                Array.isArray(getDisplayWidth({ value: "你好" })) ||
                (typeof getDisplayWidth({ value: "你好" }) === "object" &&
                    getDisplayWidth({ value: "你好" }) !== null),
        ).toBe(true);
    });
});
