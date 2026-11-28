import { describe, expect, it } from "vitest";
import { formatDateRange, getLocaleDatePattern } from "../index.js";

describe("locale patterns and ranges", () => {
    it("builds an English numeric pattern and formats a range", () => {
        expect(getLocaleDatePattern({ locale: "en-US" })).toContain("MM");
        expect(getLocaleDatePattern({ locale: "en-US" })).toContain("dd");
        expect(getLocaleDatePattern({ locale: "en-US" })).toContain("yyyy");
        const range = formatDateRange({
            start: "2026-01-03T00:00:00Z",
            end: "2026-01-05T00:00:00Z",
            timeZone: "UTC",
            locale: "en-US",
        });
        expect(range?.length).toBeGreaterThan(0);
        expect(() =>
            formatDateRange({
                start: "2026-01-05T00:00:00Z",
                end: "2026-01-03T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toThrow(RangeError);
    });
});
