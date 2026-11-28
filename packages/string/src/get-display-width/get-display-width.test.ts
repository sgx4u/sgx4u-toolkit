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
