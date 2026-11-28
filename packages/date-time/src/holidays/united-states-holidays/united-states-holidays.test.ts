import { describe, expect, it } from "vitest";
import { unitedStatesHolidays } from "../united-states.js";

describe("unitedStatesHolidays", () => {
    it("uses the observed Independence Day in 2026", () => {
        expect(unitedStatesHolidays(2026))?.toHaveLength(11);
        expect(
            unitedStatesHolidays(2026)?.find(
                (holiday) => holiday.name === "Independence Day",
            ),
        ).toEqual({ date: "2026-07-03", name: "Independence Day" });
    });

    it("returns undefined when the year is not an integer", () => {
        expect(
            unitedStatesHolidays("2026" as unknown as number),
        ).toBeUndefined();
    });
});
