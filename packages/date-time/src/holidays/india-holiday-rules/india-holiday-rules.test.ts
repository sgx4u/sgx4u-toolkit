import { describe, expect, it } from "vitest";
import { getHolidaysInYear } from "../../get-holidays-in-year/get-holidays-in-year.js";
import { indiaHolidayRules } from "../india.js";
import { unitedKingdomHolidayRules } from "../united-kingdom.js";
import { unitedStatesHolidayRules } from "../united-states.js";

describe("country holiday rules", () => {
    it("places the 2026 national dates and the United States observed Independence Day", () => {
        const india = getHolidaysInYear({
            year: 2026,
            rules: indiaHolidayRules,
        });
        expect(india).toBeDefined();
        expect(
            india!.find((holiday) => holiday.name === "Republic Day")?.date,
        ).toEqual({
            year: 2026,
            month: 1,
            day: 26,
        });
        expect(india!.find((holiday) => holiday.name === "Holi")?.date).toEqual(
            {
                year: 2026,
                month: 3,
                day: 4,
            },
        );
        expect(
            india!.find((holiday) => holiday.name === "Diwali")?.date,
        ).toEqual({
            year: 2026,
            month: 11,
            day: 8,
        });
        expect(
            getHolidaysInYear({ year: 2031, rules: indiaHolidayRules })?.some(
                (holiday) => holiday.name === "Holi",
            ),
        ).toBe(false);
        const unitedStates = getHolidaysInYear({
            year: 2026,
            rules: unitedStatesHolidayRules,
        });
        expect(unitedStates)?.toHaveLength(11);
        expect(
            unitedStates!.find((holiday) => holiday.name === "Independence Day")
                ?.observedDate,
        ).toEqual({ year: 2026, month: 7, day: 3 });
        const unitedKingdom = getHolidaysInYear({
            year: 2026,
            rules: unitedKingdomHolidayRules,
        });
        expect(
            unitedKingdom!.find((holiday) => holiday.name === "Good Friday")
                ?.date,
        ).toEqual({
            year: 2026,
            month: 4,
            day: 3,
        });
        expect(unitedKingdom!.every((holiday) => holiday.type === "bank")).toBe(
            true,
        );
    });
});
