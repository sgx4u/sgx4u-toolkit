import { describe, expect, it } from "vitest";
import { unitedKingdomHolidays } from "../united-kingdom.js";

describe("unitedKingdomHolidays", () => {
    it("returns a named Christmas date", () => {
        expect(
            unitedKingdomHolidays(2026)?.some(
                (holiday) =>
                    holiday.name === "Christmas Day" &&
                    holiday.date === "2026-12-25",
            ),
        ).toBe(true);
    });

    it("returns undefined when the year is not an integer", () => {
        expect(unitedKingdomHolidays(Number.NaN)).toBeUndefined();
    });
});
