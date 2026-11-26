import { describe, expect, it } from "vitest";
import { subtractDuration } from "../index.js";

describe("subtractDuration", () => {
    it("negates the duration before adding it", () => {
        expect(
            subtractDuration({
                date: "2026-03-31T00:00:00Z",
                duration: { months: 1 },
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-02-28T00:00:00.000Z");
        expect(
            subtractDuration({
                date: "not-a-date",
                duration: { days: 1 },
                timeZone: "UTC",
            }),
        ).toBeUndefined();
    });
});