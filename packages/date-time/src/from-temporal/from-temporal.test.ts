import { describe, expect, it } from "vitest";
import { fromTemporal } from "../index.js";

describe("fromTemporal", () => {
    it("reads epochMilliseconds from a Temporal-like object", () => {
        expect(fromTemporal({ epochMilliseconds: 0 })?.toISOString()).toBe(
            "1970-01-01T00:00:00.000Z",
        );
        expect(
            fromTemporal({
                epochMilliseconds: Date.parse("2024-02-29T12:00:00.000Z"),
            })?.toISOString(),
        ).toBe("2024-02-29T12:00:00.000Z");
    });

    it("rolls a year boundary timestamp into the next calendar day", () => {
        expect(
            fromTemporal({
                epochMilliseconds: Date.parse("2026-12-31T23:30:00.000Z"),
            })?.toISOString(),
        ).toBe("2026-12-31T23:30:00.000Z");
        expect(
            fromTemporal({
                epochMilliseconds: Date.parse("2027-01-01T00:00:00.000Z"),
            })?.toISOString(),
        ).toBe("2027-01-01T00:00:00.000Z");
    });

    it("returns undefined when epochMilliseconds is missing or not finite", () => {
        expect(fromTemporal(null as never)).toBeUndefined();
        expect(fromTemporal({ epochMilliseconds: Number.NaN })).toBeUndefined();
        expect(fromTemporal({} as never)).toBeUndefined();
    });
});
