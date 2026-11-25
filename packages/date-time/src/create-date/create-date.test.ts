import { describe, expect, it } from "vitest";
import { createDate, type DatePartsInput } from "../index.js";

describe("createDate", () => {
    it("builds an instant from wall-clock fields and defaults omitted fields", () => {
        expect(
            createDate(
                { year: 2026, month: 11, day: 26, hour: 9 },
                { timeZone: "Asia/Kolkata" },
            ).toISOString(),
        ).toBe("2026-11-26T03:30:00.000Z");
        expect(
            createDate({ year: 2026 }, { timeZone: "UTC" }).toISOString(),
        ).toBe("2026-01-01T00:00:00.000Z");
    });

    it("resolves a New York gap and overlap", () => {
        const gap = {
            year: 2024,
            month: 3,
            day: 10,
            hour: 2,
            minute: 30,
        };
        const overlap = {
            year: 2024,
            month: 11,
            day: 3,
            hour: 1,
            minute: 30,
        };

        expect(
            createDate(gap, {
                timeZone: "America/New_York",
                disambiguation: "compatible",
            }).toISOString(),
        ).toBe("2024-03-10T07:30:00.000Z");
        expect(
            createDate(gap, {
                timeZone: "America/New_York",
                disambiguation: "earlier",
            }).toISOString(),
        ).toBe("2024-03-10T06:30:00.000Z");
        expect(
            createDate(overlap, {
                timeZone: "America/New_York",
                disambiguation: "later",
            }).toISOString(),
        ).toBe("2024-11-03T06:30:00.000Z");
        expect(
            createDate(overlap, { timeZone: "America/New_York" }).toISOString(),
        ).toBe("2024-11-03T05:30:00.000Z");
        expect(() =>
            createDate(gap, {
                timeZone: "America/New_York",
                disambiguation: "reject",
            }),
        ).toThrow(RangeError);
    });

    it("moves a skipped Santiago midnight forward by default", () => {
        expect(
            createDate(
                { year: 2024, month: 9, day: 8 },
                { timeZone: "America/Santiago" },
            ).toISOString(),
        ).toBe("2024-09-08T04:00:00.000Z");
    });

    it("uses a fixed offset without a daylight-saving gap", () => {
        expect(
            createDate(
                { year: 2024, month: 3, day: 10, hour: 2, minute: 30 },
                { timeZone: "+05:30", disambiguation: "reject" },
            ).toISOString(),
        ).toBe("2024-03-09T21:00:00.000Z");
    });

    it("throws when the day does not exist or the parts have the wrong type", () => {
        expect(() =>
            createDate({ year: 2026, month: 2, day: 30 }, { timeZone: "UTC" }),
        ).toThrow(RangeError);
        expect(() =>
            createDate({ year: 2026, month: 2, day: 30 }, { timeZone: "UTC" }),
        ).toThrow("`parts.day` must be a real day of 2026-02; received 30.");
        expect(() => createDate({} as DatePartsInput)).toThrow(TypeError);
        expect(() =>
            createDate({ year: 2026, month: 13 }, { timeZone: "UTC" }),
        ).toThrow(RangeError);
        expect(() =>
            createDate({ year: 2026 }, { timeZone: "Mars/Base" }),
        ).toThrow(RangeError);
    });
});
