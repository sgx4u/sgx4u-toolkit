import { describe, expect, it } from "vitest";
import { roundToUnit } from "../index.js";

describe("roundToUnit", () => {
    it("rounds halfway away from the earlier boundary", () => {
        expect(
            roundToUnit("2024-06-15T10:07:30Z", "minute", {
                timeZone: "UTC",
                increment: 15,
            }).toISOString(),
        ).toBe("2024-06-15T10:15:00.000Z");
        expect(
            roundToUnit("2024-06-15T10:07:00Z", "minute", {
                timeZone: "UTC",
                increment: 15,
                mode: "down",
            }).toISOString(),
        ).toBe("2024-06-15T10:00:00.000Z");
        expect(() =>
            roundToUnit("2024-06-15T10:00:00Z", "minute", {
                timeZone: "UTC",
                increment: 7,
            }),
        ).toThrow(RangeError);
    });
});
