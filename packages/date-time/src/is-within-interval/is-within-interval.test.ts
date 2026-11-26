import { describe, expect, it } from "vitest";
import { isWithinInterval } from "../index.js";

describe("isWithinInterval", () => {
    const interval = {
        start: new Date("2026-01-01T00:00:00Z"),
        end: new Date("2026-01-02T00:00:00Z"),
    };

    it("includes the start and excludes the end", () => {
        expect(isWithinInterval("2026-01-01T00:00:00Z", interval)).toBe(true);
        expect(isWithinInterval("2026-01-01T23:59:59.999Z", interval)).toBe(
            true,
        );
        expect(isWithinInterval("2026-01-02T00:00:00Z", interval)).toBe(false);
        expect(isWithinInterval("2025-12-31T23:59:59.999Z", interval)).toBe(
            false,
        );
        expect(isWithinInterval(interval.start, interval)).toBe(true);
        expect(
            isWithinInterval(0, {
                start: new Date(-1),
                end: new Date(1),
            }),
        ).toBe(true);
    });

    it("covers leap day, month end, and the year bounds", () => {
        expect(
            isWithinInterval("2024-02-29T12:00:00Z", {
                start: new Date("2024-02-28T00:00:00Z"),
                end: new Date("2024-03-01T00:00:00Z"),
            }),
        ).toBe(true);
        expect(
            isWithinInterval("2024-03-01T00:00:00Z", {
                start: new Date("2024-02-28T00:00:00Z"),
                end: new Date("2024-03-01T00:00:00Z"),
            }),
        ).toBe(false);
        expect(
            isWithinInterval("2026-01-31T23:59:59Z", {
                start: new Date("2026-01-31T00:00:00Z"),
                end: new Date("2026-02-01T00:00:00Z"),
            }),
        ).toBe(true);
        expect(
            isWithinInterval("0000-01-01T00:00:00Z", {
                start: new Date("0000-01-01T00:00:00Z"),
                end: new Date("0000-01-02T00:00:00Z"),
            }),
        ).toBe(true);
        expect(
            isWithinInterval("9999-12-31T23:59:59.999Z", {
                start: new Date("9999-12-31T00:00:00Z"),
                end: new Date("9999-12-31T23:59:59.999Z"),
            }),
        ).toBe(false);
        expect(
            isWithinInterval("9999-12-31T23:59:59.998Z", {
                start: new Date("9999-12-31T00:00:00Z"),
                end: new Date("9999-12-31T23:59:59.999Z"),
            }),
        ).toBe(true);
    });

    it("returns false for an empty interval", () => {
        const instant = new Date("2026-06-15T12:00:00Z");

        expect(
            isWithinInterval(instant, { start: instant, end: instant }),
        ).toBe(false);
        expect(
            isWithinInterval("0000-02-29T00:00:00Z", {
                start: new Date("0000-02-29T00:00:00Z"),
                end: new Date("0000-02-29T00:00:00Z"),
            }),
        ).toBe(false);
    });

    it("throws when the date or the interval is invalid", () => {
        expect(() => isWithinInterval("2024-02-30", interval)).toThrow(
            RangeError,
        );
        expect(() => isWithinInterval(new Date(Number.NaN), interval)).toThrow(
            RangeError,
        );
        expect(() =>
            isWithinInterval(null as unknown as string, interval),
        ).toThrow(TypeError);
        expect(() =>
            isWithinInterval("2026-01-01T00:00:00Z", {
                start: new Date("2026-01-02T00:00:00Z"),
                end: new Date("2026-01-01T00:00:00Z"),
            }),
        ).toThrow(RangeError);
        expect(() =>
            isWithinInterval("2026-01-01T00:00:00Z", null as unknown as never),
        ).toThrow(TypeError);
    });
});
