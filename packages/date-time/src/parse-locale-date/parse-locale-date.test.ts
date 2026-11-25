import { describe, expect, it } from "vitest";
import { formatTimeZoneName, parseLocaleDate } from "../index.js";

describe("locale dates and zone names", () => {
    it("parses an en-US numeric date and names a zone offset", () => {
        expect(
            parseLocaleDate("11/26/2026", {
                locale: "en-US",
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-11-26T00:00:00.000Z");
        expect(
            parseLocaleDate("02/30/2026", { locale: "en-US", timeZone: "UTC" }),
        ).toBeUndefined();
        expect(
            formatTimeZoneName("Asia/Kolkata", {
                locale: "en-US",
                style: "longOffset",
                at: "2026-01-01T00:00:00Z",
            }),
        ).toBe("GMT+05:30");
    });
});
