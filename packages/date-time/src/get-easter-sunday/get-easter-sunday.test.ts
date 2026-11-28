import { describe, expect, it } from "vitest";
import { fromTemporal, getEasterSunday, toTemporalInstant } from "../index.js";

describe("Easter and Temporal interop", () => {
    it("computes western and orthodox Easter", () => {
        expect(getEasterSunday({ year: 2024 })).toEqual({
            year: 2024,
            month: 3,
            day: 31,
        });
        expect(getEasterSunday({ year: 2025 })).toEqual({
            year: 2025,
            month: 4,
            day: 20,
        });
        expect(getEasterSunday({ year: 2026 })).toEqual({
            year: 2026,
            month: 4,
            day: 5,
        });
        expect(getEasterSunday({ year: 2024, tradition: "orthodox" })).toEqual({
            year: 2024,
            month: 5,
            day: 5,
        });
        expect(getEasterSunday({ year: 2026, tradition: "orthodox" })).toEqual({
            year: 2026,
            month: 4,
            day: 12,
        });
        expect(getEasterSunday({ year: 1500 })).toBeUndefined();
    });

    it("throws for an unknown tradition", () => {
        expect(() =>
            getEasterSunday({ year: 2026, tradition: "byzantine" as never }),
        ).toThrow(RangeError);
    });

    it("returns undefined for a non-integer year", () => {
        expect(getEasterSunday({ year: 2024.5 })).toBeUndefined();
    });

    it("reads epochMilliseconds and reports a missing Temporal global", () => {
        expect(fromTemporal({ epochMilliseconds: 0 })?.toISOString()).toBe(
            "1970-01-01T00:00:00.000Z",
        );
        expect(fromTemporal({ epochMilliseconds: Number.NaN })).toBeUndefined();
        expect(() => toTemporalInstant(0)).toThrow(TypeError);
    });
});
