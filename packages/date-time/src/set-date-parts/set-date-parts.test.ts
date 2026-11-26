import { describe, expect, it } from "vitest";
import { setDateParts } from "../index.js";

describe("setDateParts", () => {
    it("replaces one field and constrains an impossible day", () => {
        expect(
            setDateParts({
                date: "2026-01-15T00:00:00Z",
                parts: { day: 31 },
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-01-31T00:00:00.000Z");
        expect(
            setDateParts({
                date: "2026-01-31T00:00:00Z",
                parts: { month: 2 },
                timeZone: "UTC",
            })?.toISOString(),
        ).toBe("2026-02-28T00:00:00.000Z");
        expect(() =>
            setDateParts({
                date: "2026-01-31T00:00:00Z",
                parts: { month: 2 },
                timeZone: "UTC",
                overflow: "reject",
            }),
        ).toThrow(RangeError);
    });
});
