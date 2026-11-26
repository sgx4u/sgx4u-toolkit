import { describe, expect, it } from "vitest";
import { formatUtcOffset } from "../index.js";

describe("formatUtcOffset", () => {
    it("writes an extended offset and keeps zero as +00:00", () => {
        expect(formatUtcOffset(330)).toBe("+05:30");
        expect(formatUtcOffset(0)).toBe("+00:00");
        expect(formatUtcOffset(0, { style: "extended" })).toBe("+00:00");
        expect(formatUtcOffset(0, { useZForZero: false })).toBe("+00:00");
        expect(formatUtcOffset(0, { useZForZero: true })).toBe("Z");
        expect(formatUtcOffset(-332.4)).toBe("-05:32");
    });

    it("writes basic and short forms, dropping a zero minute part", () => {
        expect(formatUtcOffset(330, { style: "basic" })).toBe("+0530");
        expect(formatUtcOffset(-90, { style: "short" })).toBe("-1:30");
        expect(formatUtcOffset(300, { style: "short" })).toBe("+5");
        expect(formatUtcOffset(-300, { style: "short" })).toBe("-5");
    });

    it("throws when the offset is not a finite number or the style is unknown", () => {
        expect(() => formatUtcOffset("5" as never)).toThrow(TypeError);
        expect(() => formatUtcOffset("5" as never)).toThrow(
            "`offsetMinutes` must be a number",
        );
        expect(() => formatUtcOffset(Number.NaN)).toThrow(RangeError);
        expect(() => formatUtcOffset(Number.NaN)).toThrow("finite number");
        expect(() => formatUtcOffset(0, { style: "wide" as never })).toThrow(
            RangeError,
        );
        expect(() => formatUtcOffset(0, { style: "wide" as never })).toThrow(
            '"extended", "basic", or "short"',
        );
    });
});
