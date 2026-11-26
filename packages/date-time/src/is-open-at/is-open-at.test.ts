import { describe, expect, it } from "vitest";
import { getNextClosingTime, getNextOpeningTime, isOpenAt } from "../index.js";

const thursdayHours = {
    hours: { 4: [{ start: "09:00", end: "17:00" }] },
} as const;

describe("opening hours", () => {
    it("opens Thursday 09:00 to 17:00 and continues an overnight range", () => {
        expect(
            isOpenAt({
                date: "2026-11-26T12:00:00Z",
                schedule: thursdayHours,
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            isOpenAt({
                date: "2026-11-26T18:00:00Z",
                schedule: thursdayHours,
                timeZone: "UTC",
            }),
        ).toBe(false);
        expect(
            getNextOpeningTime({
                date: "2026-11-26T08:00:00Z",
                schedule: thursdayHours,
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-11-26T09:00:00.000Z");
        expect(
            getNextClosingTime({
                date: "2026-11-26T12:00:00Z",
                schedule: thursdayHours,
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-11-26T17:00:00.000Z");
        const overnight = {
            hours: { 4: [{ start: "22:00", end: "02:00" }] },
        };
        expect(
            isOpenAt({
                date: "2026-11-27T01:00:00Z",
                schedule: overnight,
                timeZone: "UTC",
            }),
        ).toBe(true);
        expect(
            isOpenAt({
                date: "2026-11-27T01:00:00Z",
                schedule: {
                    ...overnight,
                    closures: [{ year: 2026, month: 11, day: 26 }],
                },
                timeZone: "UTC",
            }),
        ).toBe(false);
    });
});
