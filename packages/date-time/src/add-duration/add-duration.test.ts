import { describe, expect, it } from "vitest";
import { addDuration } from "../index.js";

describe("addDuration", () => {
    it("clamps month ends and keeps clock time across daylight saving", () => {
        expect(
            addDuration({
                date: "2026-01-31T00:00:00Z",
                duration: { months: 1 },
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-02-28T00:00:00.000Z");
        expect(
            addDuration({
                date: "2024-03-09T14:00:00Z",
                duration: { days: 1 },
                timeZone: "America/New_York",
            })?.toISOString(),
        ).toBe("2024-03-10T13:00:00.000Z");
        expect(
            addDuration({
                date: "2024-03-09T14:00:00Z",
                duration: { hours: 24 },
                timeZone: "America/New_York",
            })?.toISOString(),
        ).toBe("2024-03-10T14:00:00.000Z");
        expect(() =>
            addDuration({
                date: "2026-01-31T00:00:00Z",
                duration: { months: 1 },
                timeZone: "UTC",
                overflow: "reject",
            }),
        ).toThrow(RangeError);
        expect(
            addDuration({
                date: "2026-01-01T00:00:00Z",
                duration: { days: 1, hours: -1 },
                timeZone: "UTC",
            }),
        ).toBeUndefined();
    });
});
