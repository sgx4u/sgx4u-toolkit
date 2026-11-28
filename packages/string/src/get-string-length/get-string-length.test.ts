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
