import { describe, expect, it } from "vitest";
import { formatRecurrenceRule } from "../recurrence.js";

describe("formatRecurrenceRule", () => {
    it("writes a weekly rule with an interval and weekdays", () => {
        expect(
            formatRecurrenceRule({
                start: new Date("2024-12-31T00:00:00Z"),
                frequency: "weekly",
                interval: 1,
                byWeekday: [{ weekday: 2, occurrence: -1 }],
            }),
        ).toBe("DTSTART:20241231T000000Z\nRRULE:FREQ=WEEKLY;BYDAY=-1TU");
    });

    it("omits the default interval and writes an excluded leap-day instant", () => {
        expect(
            formatRecurrenceRule({
                start: new Date("2024-02-29T12:00:00Z"),
                frequency: "yearly",
                excludedDates: [new Date("2028-02-29T12:00:00Z")],
            }),
        ).toBe(
            "DTSTART:20240229T120000Z\nRRULE:FREQ=YEARLY\nEXDATE:20280229T120000Z",
        );
    });

    it("writes both copies of the fall-back hour as 01:30 in New York", () => {
        const rule = {
            frequency: "daily" as const,
            timeZone: "America/New_York",
        };
        expect(
            formatRecurrenceRule({
                ...rule,
                start: new Date("2024-11-03T05:30:00Z"),
            }),
        ).toBe(
            "DTSTART;TZID=America/New_York:20241103T013000\nRRULE:FREQ=DAILY",
        );
        expect(
            formatRecurrenceRule({
                ...rule,
                start: new Date("2024-11-03T06:30:00Z"),
            }),
        ).toBe(
            "DTSTART;TZID=America/New_York:20241103T013000\nRRULE:FREQ=DAILY",
        );
        expect(
            formatRecurrenceRule({
                ...rule,
                start: new Date("2024-03-10T06:30:00Z"),
            }),
        ).toBe(
            "DTSTART;TZID=America/New_York:20240310T013000\nRRULE:FREQ=DAILY",
        );
    });

    it("throws when the rule is missing", () => {
        expect(() => formatRecurrenceRule(null as never)).toThrow(TypeError);
    });
});
