import { describe, expect, it } from "vitest";
import { formatDate } from "../index.js";

describe("formatDate", () => {
    it("formats numeric tokens in the zone and keeps quoted text", () => {
        expect(
            formatDate({
                date: "2026-11-25T22:00:00.000Z",
                pattern: "yyyy-MM-dd HH:mm",
                timeZone: "Asia/Kolkata",
            }),
        ).toBe("2026-11-26 03:30");
        expect(
            formatDate({
                date: "2026-11-26T03:30:00.000Z",
                pattern: "'Q'QQ yyyy",
                timeZone: "UTC",
            }),
        ).toBe("Q04 2026");
        expect(
            formatDate({
                date: "2026-11-26T00:00:00.000Z",
                pattern: "XXX",
                timeZone: "UTC",
            }),
        ).toBe("Z");
    });

    it("throws for an unknown token and reads a month name from Intl", () => {
        expect(() =>
            formatDate({
                date: "2026-11-26T00:00:00Z",
                pattern: "yyyy-QQQQQ",
                timeZone: "UTC",
            }),
        ).toThrow(RangeError);
        expect(
            formatDate({
                date: "2026-11-26T00:00:00Z",
                pattern: "MMMM",
                timeZone: "UTC",
                locale: "en-US",
            }),
        ).toBe("November");
    });

    it("returns undefined for an invalid date and throws when pattern is not a string", () => {
        expect(
            formatDate({
                date: "nope",
                pattern: "yyyy-MM-dd",
            }),
        ).toBeUndefined();
        expect(() =>
            formatDate({
                date: "2026-01-01T00:00:00Z",
                pattern: 1 as unknown as string,
            }),
        ).toThrow(TypeError);
    });
});
