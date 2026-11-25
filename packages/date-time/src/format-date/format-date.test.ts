import { describe, expect, it } from "vitest";
import { formatDate } from "../index.js";

describe("formatDate", () => {
    it("formats numeric tokens in the zone and keeps quoted text", () => {
        expect(
            formatDate("2026-11-25T22:00:00.000Z", "yyyy-MM-dd HH:mm", {
                timeZone: "Asia/Kolkata",
            }),
        ).toBe("2026-11-26 03:30");
        expect(
            formatDate("2026-11-26T03:30:00.000Z", "'Q'QQ yyyy", {
                timeZone: "UTC",
            }),
        ).toBe("Q04 2026");
        expect(
            formatDate("2026-11-26T00:00:00.000Z", "XXX", { timeZone: "UTC" }),
        ).toBe("Z");
    });

    it("throws for an unknown token and reads a month name from Intl", () => {
        expect(() =>
            formatDate("2026-11-26T00:00:00Z", "yyyy-QQQQQ", {
                timeZone: "UTC",
            }),
        ).toThrow(RangeError);
        expect(
            formatDate("2026-11-26T00:00:00Z", "MMMM", {
                timeZone: "UTC",
                locale: "en-US",
            }),
        ).toBe("November");
    });
});
