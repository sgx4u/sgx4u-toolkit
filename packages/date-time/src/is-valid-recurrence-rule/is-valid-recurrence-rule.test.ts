import { describe, expect, it } from "vitest";
import { isValidRecurrenceRule } from "../recurrence.js";

const daily = "DTSTART:20261126T090000Z\nRRULE:FREQ=DAILY";

describe("isValidRecurrenceRule", () => {
    it("accepts a daily rule and a weekly rule with a time zone", () => {
        expect(isValidRecurrenceRule(daily)).toBe(true);
        expect(
            isValidRecurrenceRule(
                "DTSTART:20240229T000000Z\nRRULE:FREQ=YEARLY",
            ),
        ).toBe(true);
        expect(
            isValidRecurrenceRule(
                "DTSTART;TZID=America/New_York:20261126T090000\nRRULE:FREQ=WEEKLY;BYDAY=MO,FR",
            ),
        ).toBe(true);
        expect(
            isValidRecurrenceRule(
                "DTSTART:20261126T090000Z\nRRULE:FREQ=DAILY\nEXDATE:20261127T090000Z",
            ),
        ).toBe(true);
    });

    it("rejects unsupported, incomplete, and impossible rules", () => {
        const rejected = [
            "",
            "   ",
            "RRULE:FREQ=DAILY",
            "DTSTART:20261126T090000Z",
            "DTSTART:20261126T090000Z\nRRULE:FREQ=DAILY;RSCALE=GREGORIAN",
            "DTSTART:20261126T090000Z\nRRULE:FREQ=DAILY;SKIP=OMIT",
            "DTSTART:20261126T090000Z\nRRULE:FREQ=DAILY;COUNT=2;UNTIL=20261201T000000Z",
            "DTSTART:20240230T000000Z\nRRULE:FREQ=DAILY",
            "DTSTART:20261126T090000Z\nRRULE:FREQ=NEVER",
            "not a rule",
        ];

        for (const value of rejected) {
            expect(isValidRecurrenceRule(value)).toBe(false);
        }
    });

    it("throws TypeError when the text is not a string", () => {
        expect(() =>
            isValidRecurrenceRule(undefined as unknown as string),
        ).toThrow(TypeError);
        expect(() => isValidRecurrenceRule(1 as unknown as string)).toThrow(
            TypeError,
        );
        expect(() => isValidRecurrenceRule(null as unknown as string)).toThrow(
            "`value` must be a string; received null.",
        );
    });

    it("rejects a time zone name the runtime does not know", () => {
        expect(
            isValidRecurrenceRule(
                "DTSTART;TZID=Mars/Base:20261126T090000\nRRULE:FREQ=DAILY",
            ),
        ).toBe(false);
    });
});
