import { describe, expect, it } from "vitest";
import {
    describeRecurrenceRule,
    getNextRecurrenceOccurrence,
    isValidRecurrenceRule,
    listRecurrenceOccurrences,
    parseRecurrenceRule,
} from "../recurrence.js";

const weekly = `DTSTART:20261126T090000Z
RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,FR`;

describe("recurrence", () => {
    it("expands every second week on Monday and Friday", () => {
        expect(
            parseRecurrenceRule(
                "DTSTART:20261126T090000Z\nRRULE:FREQ=DAILY;RSCALE=GREGORIAN",
            ),
        ).toBeUndefined();
        expect(isValidRecurrenceRule(weekly)).toBe(true);
        const rule = parseRecurrenceRule(weekly);
        expect(rule).toBeDefined();
        if (rule === undefined) {
            return;
        }
        expect(describeRecurrenceRule(rule)).toBe(
            "Every 2 weeks on Monday and Friday",
        );
        expect(
            listRecurrenceOccurrences(rule, {
                between: {
                    start: new Date("2026-11-26T00:00:00Z"),
                    end: new Date("2026-12-12T00:00:00Z"),
                },
            }).map((date) => date.toISOString()),
        ).toEqual([
            "2026-11-27T09:00:00.000Z",
            "2026-12-07T09:00:00.000Z",
            "2026-12-11T09:00:00.000Z",
        ]);
        expect(
            getNextRecurrenceOccurrence(
                { start: new Date("2026-11-26T09:00:00Z"), frequency: "daily" },
                { now: "2026-11-26T09:00:00Z" },
            )?.toISOString(),
        ).toBe("2026-11-27T09:00:00.000Z");
    });
});
