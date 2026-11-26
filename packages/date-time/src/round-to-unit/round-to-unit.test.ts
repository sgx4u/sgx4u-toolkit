import { describe, expect, it } from "vitest";
import { roundToUnit } from "../index.js";

describe("roundToUnit", () => {
    it("rounds halfway away from the earlier boundary", () => {
        expect(
            roundToUnit({ date: "2024-06-15T10:07:30Z", unit: "minute", ...{
                timeZone: "UTC",
                increment: 15,
            } }).toISOString(),
        ).toBe("2024-06-15T10:15:00.000Z");
        expect(
            roundToUnit({ date: "2024-06-15T10:07:00Z", unit: "minute", ...{
                timeZone: "UTC",
                increment: 15,
                mode: "down",
            } }).toISOString(),
        ).toBe("2024-06-15T10:00:00.000Z");
        expect(() =>
            roundToUnit({ date: "2024-06-15T10:00:00Z", unit: "minute", ...{
                timeZone: "UTC",
                increment: 7,
            } }),
        ).toThrow(RangeError);
    });
});
