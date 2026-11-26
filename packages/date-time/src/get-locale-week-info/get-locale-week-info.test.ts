import { describe, expect, it } from "vitest";
import { getLocaleWeekInfo } from "../index.js";

const isoWeek = {
    firstDay: 1,
    weekendDays: [6, 7],
    minimumDaysInFirstWeek: 4,
};

describe("getLocaleWeekInfo", () => {
    it("reports Sunday as the first day in en-US and Monday in en-GB", () => {
        expect(getLocaleWeekInfo("en-US")).toEqual({
            firstDay: 7,
            weekendDays: [6, 7],
            minimumDaysInFirstWeek: 4,
        });
        expect(getLocaleWeekInfo("en-GB")).toEqual(isoWeek);
        expect(getLocaleWeekInfo("de-DE").firstDay).toBe(1);
    });

    it("uses the runtime locale when the argument is omitted", () => {
        expect(getLocaleWeekInfo()).toEqual(getLocaleWeekInfo("en-US"));
    });

    it("falls back to the ISO week when the locale is unknown", () => {
        expect(getLocaleWeekInfo("not a locale")).toEqual(isoWeek);
    });
});
