import { describe, expect, it } from "vitest";
import { indiaHolidays } from "../india.js";

describe("indiaHolidays", () => {
    it("returns observed dates that can be passed as holidays", () => {
        const holidays = indiaHolidays(2026);
        expect(
            holidays?.find((holiday) => holiday.name === "Republic Day"),
        ).toEqual({ date: "2026-01-26", name: "Republic Day" });
        expect(holidays?.find((holiday) => holiday.name === "Holi")).toEqual({
            date: "2026-03-04",
            name: "Holi",
        });
        expect(
            indiaHolidays(2031)?.some((holiday) => holiday.name === "Holi"),
        ).toBe(false);
    });

    it("returns undefined when the year is not an integer", () => {
        expect(indiaHolidays(2026.5)).toBeUndefined();
        expect(indiaHolidays(Number.NaN)).toBeUndefined();
    });
});
