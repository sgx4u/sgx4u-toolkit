import { describe, expect, it } from "vitest";
import { addBusinessDays, isBusinessDay } from "../index.js";

describe("business days", () => {
    it("skips the weekend and keeps the time of day", () => {
        expect(
            isBusinessDay({ date: "2026-11-28T00:00:00Z", timeZone: "UTC" }),
        ).toBe(false);
        expect(
            isBusinessDay({ date: "2026-11-27T00:00:00Z", timeZone: "UTC" }),
        ).toBe(true);
        expect(
            addBusinessDays({
                date: "2026-11-27T15:00:00Z",
                amount: 1,
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-11-30T15:00:00.000Z");
        expect(
            addBusinessDays({
                date: "2026-11-28T15:00:00Z",
                amount: 1,
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-11-30T15:00:00.000Z");
        expect(
            addBusinessDays({
                date: "2026-11-27T15:00:00Z",
                amount: 0,
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-11-27T15:00:00.000Z");
        expect(
            isBusinessDay({
                date: "2026-11-26T00:00:00Z",
                timeZone: "UTC",
                holidays: ["2026-11-26"],
            }),
        ).toBe(false);
    });

    it("returns undefined for a bad date or non-integer amount", () => {
        expect(
            addBusinessDays({
                date: "nope",
                amount: 1,
                timeZone: "UTC",
            }),
        ).toBeUndefined();
        expect(
            addBusinessDays({
                date: "2026-11-27T15:00:00Z",
                amount: 1.5,
                timeZone: "UTC",
            }),
        ).toBeUndefined();
    });
});
