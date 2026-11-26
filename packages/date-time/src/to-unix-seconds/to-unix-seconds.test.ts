import { describe, expect, it } from "vitest";
import { toUnixSeconds } from "../index.js";

describe("toUnixSeconds", () => {
    it("rounds toward minus infinity", () => {
        expect(toUnixSeconds(0)).toBe(0);
        expect(toUnixSeconds(-0)).toBe(0);
        expect(toUnixSeconds(999)).toBe(0);
        expect(toUnixSeconds(1_000)).toBe(1);
        expect(toUnixSeconds(1_900)).toBe(1);
        expect(toUnixSeconds("1970-01-01T00:00:01.900Z")).toBe(1);
        expect(toUnixSeconds(-1)).toBe(-1);
        expect(toUnixSeconds(-1_000)).toBe(-1);
        expect(toUnixSeconds(-1_001)).toBe(-2);
        expect(toUnixSeconds(-1_500)).toBe(-2);
        expect(toUnixSeconds(new Date(-1_500))).toBe(-2);
    });

    it("converts leap day and the year bounds", () => {
        expect(toUnixSeconds("2024-02-29T00:00:00.999Z")).toBe(
            Math.floor(Date.parse("2024-02-29T00:00:00.999Z") / 1000),
        );
        expect(toUnixSeconds("0000-01-01T00:00:00.000Z")).toBe(
            Math.floor(Date.parse("0000-01-01T00:00:00.000Z") / 1000),
        );
        expect(toUnixSeconds("9999-12-31T23:59:59.999Z")).toBe(
            Math.floor(Date.parse("9999-12-31T23:59:59.999Z") / 1000),
        );
        expect(toUnixSeconds("2026-01-31T23:59:59.100Z")).toBe(
            Math.floor(Date.parse("2026-01-31T23:59:59.100Z") / 1000),
        );
    });

    it("throws when the date is not real", () => {
        expect(toUnixSeconds("2024-02-30")).toBeUndefined();
        expect(() => toUnixSeconds(new Date(Number.NaN))).toThrow(RangeError);
        expect(toUnixSeconds(Number.NaN)).toBeUndefined();
        expect(toUnixSeconds(null as unknown as number)).toBeUndefined();
    });
});
