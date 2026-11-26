import { describe, expect, it } from "vitest";
import { getWeekdayNames } from "../index.js";

describe("getWeekdayNames", () => {
    it("starts the English long names on Monday", () => {
        expect(getWeekdayNames({ locale: "en-US" })[0]).toBe("Monday");
        expect(getWeekdayNames({ locale: "en-US" })).toHaveLength(7);
    });

    it("rotates to Sunday and shortens the names", () => {
        expect(getWeekdayNames({ locale: "en-US", startsOn: 7 })).toEqual([
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ]);
        expect(getWeekdayNames({ locale: "en-US", width: "short" })).toEqual([
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
        ]);
        expect(getWeekdayNames({ locale: "en-US", width: "narrow" })[0]).toBe(
            "M",
        );
        expect(getWeekdayNames({ locale: "en-US", startsOn: 4 })[0]).toBe(
            "Thursday",
        );
    });

    it("rejects an unknown width or a week start outside 1 through 7", () => {
        expect(() => getWeekdayNames({ width: "wide" as never })).toThrow(
            RangeError,
        );
        expect(() => getWeekdayNames({ width: "wide" as never })).toThrow(
            "`width`",
        );
        expect(() => getWeekdayNames({ startsOn: 0 as never })).toThrow(
            RangeError,
        );
        expect(() => getWeekdayNames({ startsOn: 0 as never })).toThrow(
            "`weekStartsOn`",
        );
        expect(() => getWeekdayNames({ startsOn: "Monday" as never })).toThrow(
            TypeError,
        );
        expect(() => getWeekdayNames({ startsOn: "Monday" as never })).toThrow(
            "`weekStartsOn`",
        );
    });

    it("defaults to long names starting on Monday", () => {
        expect(getWeekdayNames()).toEqual(
            getWeekdayNames({ width: "long", startsOn: 1 }),
        );
        expect(getWeekdayNames({ locale: "en-US" })).toEqual(
            getWeekdayNames({ locale: "en-US", width: "long", startsOn: 1 }),
        );
    });
});
