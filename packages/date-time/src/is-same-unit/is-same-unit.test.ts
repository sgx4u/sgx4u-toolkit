import { describe, expect, it } from "vitest";
import { isSameUnit } from "../index.js";

describe("isSameUnit", () => {
    it("uses the zone's calendar day, including across midnight UTC", () => {
        expect(
            isSameUnit("2024-06-15T23:00:00Z", "2024-06-16T02:00:00Z", "day", {
                timeZone: "Asia/Kolkata",
            }),
        ).toBe(true);
        expect(
            isSameUnit("2024-03-10T05:30:00Z", "2024-03-10T06:30:00Z", "day", {
                timeZone: "America/New_York",
            }),
        ).toBe(true);
    });
});
