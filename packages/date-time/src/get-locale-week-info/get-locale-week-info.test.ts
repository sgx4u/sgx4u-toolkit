import { describe, expect, it } from "vitest";
import { getLocaleWeekInfo } from "../index.js";

const isoWeek = {
    firstDay: 1,
    weekendDays: [6, 7],
    minimumDaysInFirstWeek: 4,
};

describe("getLocaleWeekInfo", () => {
    it("reports Sunday as the first day in en-US and Monday in en-GB", () => {
        const unitedStates = getLocaleWeekInfo("en-US");
        expect(unitedStates.firstDay).toBe(7);
        expect(unitedStates.weekendDays).toEqual([6, 7]);
        expect(unitedStates.minimumDaysInFirstWeek).toBeGreaterThanOrEqual(1);
        expect(getLocaleWeekInfo("en-GB").firstDay).toBe(1);
        expect(getLocaleWeekInfo("de-DE").firstDay).toBe(1);
    });

    it("uses the runtime locale when the argument is omitted", () => {
        expect(getLocaleWeekInfo()).toEqual(getLocaleWeekInfo("en-US"));
    });

    it("falls back to the ISO week when the locale is unknown", () => {
        expect(getLocaleWeekInfo("not a locale")).toEqual(isoWeek);
    });
});
