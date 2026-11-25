import { describe, expect, it } from "vitest";
import { endOfUnit } from "../index.js";

describe("endOfUnit", () => {
    it("is the millisecond before the next unit", () => {
        expect(
            endOfUnit("2026-11-26T15:45:00Z", "day", {
                timeZone: "UTC",
            }).toISOString(),
        ).toBe("2026-11-26T23:59:59.999Z");
        expect(
            endOfUnit("2026-11-26T15:45:00Z", "year", {
                timeZone: "UTC",
            }).toISOString(),
        ).toBe("2026-12-31T23:59:59.999Z");
    });
});
