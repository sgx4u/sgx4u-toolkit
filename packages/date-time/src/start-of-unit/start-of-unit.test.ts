import { describe, expect, it } from "vitest";
import { startOfUnit } from "../index.js";

describe("startOfUnit", () => {
    it("aligns to the unit and moves a skipped midnight forward", () => {
        expect(
            startOfUnit("2026-11-26T15:45:00Z", "day", {
                timeZone: "UTC",
            }).toISOString(),
        ).toBe("2026-11-26T00:00:00.000Z");
        expect(
            startOfUnit("2024-09-08T12:00:00Z", "day", {
                timeZone: "America/Santiago",
            }).toISOString(),
        ).toBe("2024-09-08T04:00:00.000Z");
        expect(
            startOfUnit("2026-11-26T00:00:00Z", "decade", {
                timeZone: "UTC",
            }).toISOString(),
        ).toBe("2020-01-01T00:00:00.000Z");
    });
});
