import { describe, expect, it } from "vitest";
import { getDateParts, toDate } from "../index.js";

describe("toDate", () => {
    it("returns a new Date for a Date, a timestamp, and an offset string", () => {
        const original = new Date("2024-06-15T16:00:00.000Z");
        const originalTime = original.getTime();
        const fromDate = toDate({ date: original });
        const fromTimestamp = toDate({ date: originalTime });
        const fromOffset = toDate({ date: "2024-02-29T00:00:00+0530" });

        expect(fromDate).not.toBe(original);
        expect(fromDate?.getTime()).toBe(originalTime);
        expect(original.getTime()).toBe(originalTime);
        expect(fromTimestamp?.getTime()).toBe(originalTime);
        expect(fromOffset?.toISOString()).toBe("2024-02-28T18:30:00.000Z");
    });

    it("reads a date-only string as midnight in the given zone", () => {
        expect(
            toDate({ date: "2026-11-26", timeZone: "Asia/Kolkata" })?.toISOString(),
        ).toBe("2026-11-25T18:30:00.000Z");
        expect(
            toDate({ date: "2026-11-26", timeZone: "UTC" })?.toISOString(),
        ).toBe("2026-11-26T00:00:00.000Z");
    });

    it("uses the system zone when timeZone is omitted", () => {
        const result = toDate({ date: "2024-06-15" });
        const parts = getDateParts({ date: result! });

        expect(parts?.year).toBe(2024);
        expect(parts?.month).toBe(6);
        expect(parts?.day).toBe(15);
        expect(parts?.hour).toBe(0);
        expect(parts?.minute).toBe(0);
    });

    it("moves a skipped midnight forward in America/Santiago", () => {
        expect(
            toDate({
                date: "2024-09-08",
                timeZone: "America/Santiago",
            })?.toISOString(),
        ).toBe("2024-09-08T04:00:00.000Z");
    });

    it("returns undefined for an invalid date and throws for a bad zone", () => {
        expect(toDate({ date: "2024-02-30" })).toBeUndefined();
        expect(toDate({ date: new Date(Number.NaN) })).toBeUndefined();
        expect(toDate({ date: true as unknown as string })).toBeUndefined();
        expect(() =>
            toDate({ date: "2024-06-15", timeZone: "Mars/Base" }),
        ).toThrow(RangeError);
    });
});