import { describe, expect, it } from "vitest";
import { formatTimeOfDay } from "../index.js";

const afternoon = { hour: 15, minute: 30, second: 4, millisecond: 7 };

describe("formatTimeOfDay", () => {
    it("formats to the minute and follows the locale hour cycle", () => {
        expect(
            formatTimeOfDay({
                time: afternoon,
                locale: "en-US",
                hourCycle: "h23",
            }),
        ).toBe("15:30");
        expect(formatTimeOfDay({ time: afternoon, locale: "en-US" })).toBe(
            "3:30 PM",
        );
        expect(formatTimeOfDay({ time: afternoon, locale: "en-GB" })).toBe(
            "15:30",
        );
    });

    it("shows seconds or milliseconds when precision asks for them", () => {
        expect(
            formatTimeOfDay(
                { hour: 0, minute: 0, second: 5, millisecond: 9 },
                { locale: "en-GB", hourCycle: "h23", precision: "second" },
            ),
        ).toBe("0:00:05");
        expect(
            formatTimeOfDay(
                { hour: 23, minute: 59, second: 59, millisecond: 7 },
                {
                    locale: "en-US",
                    hourCycle: "h23",
                    precision: "millisecond",
                },
            ),
        ).toBe("23:59:59.007");
        expect(
            formatTimeOfDay(
                { hour: 0, minute: 0, second: 0, millisecond: 0 },
                { locale: "en-US", hourCycle: "h12" },
            ),
        ).toBe("12:00 AM");
    });

    it("defaults precision to the minute", () => {
        expect(
            formatTimeOfDay({
                time: afternoon,
                locale: "en-US",
                hourCycle: "h23",
                precision: "minute",
            }),
        ).toBe(
            formatTimeOfDay({
                time: afternoon,
                locale: "en-US",
                hourCycle: "h23",
            }),
        );
    });

    it("throws for a value that is not a time or an unknown precision", () => {
        expect(() => formatTimeOfDay({ time: null as never })).toThrow(
            TypeError,
        );
        expect(() => formatTimeOfDay({ time: null as never })).toThrow(
            "`time` must be a time of day; received null.",
        );
        expect(() =>
            formatTimeOfDay({ time: afternoon, precision: "hour" as never }),
        ).toThrow(RangeError);
        expect(() =>
            formatTimeOfDay({ time: afternoon, precision: "hour" as never }),
        ).toThrow('"minute", "second", or "millisecond"');
        expect(() =>
            formatTimeOfDay({ time: afternoon, hourCycle: "h99" as never }),
        ).toThrow(RangeError);
        expect(() =>
            formatTimeOfDay({ time: afternoon, hourCycle: "h99" as never }),
        ).toThrow("hourCycle");
    });
});
