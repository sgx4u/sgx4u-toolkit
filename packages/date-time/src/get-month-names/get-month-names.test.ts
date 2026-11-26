import { describe, expect, it } from "vitest";
import {
    formatDateWithStyle,
    getLocaleHourCycle,
    getMonthNames,
    getWeekdayNames,
} from "../index.js";

describe("locale display", () => {
    it("formats a medium date and lists English month and weekday names", () => {
        expect(
            formatDateWithStyle({
                date: "2026-11-26T00:00:00Z",
                timeZone: "UTC",
                locale: "en-US",
            }),
        ).toBe("Nov 26, 2026");
        expect(getMonthNames({ locale: "en-US" })[0]).toBe("January");
        expect(getMonthNames({ locale: "en-US" }))?.toHaveLength(12);
        expect(getWeekdayNames({ locale: "en-US" })[0]).toBe("Monday");
        expect(getWeekdayNames({ locale: "en-US", startsOn: 7 })[0]).toBe(
            "Sunday",
        );
        expect(getLocaleHourCycle("en-US")).toBe("h12");
    });
});
