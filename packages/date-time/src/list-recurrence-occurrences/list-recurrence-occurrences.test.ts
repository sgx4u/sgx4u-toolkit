import { describe, expect, it } from "vitest";
import { listRecurrenceOccurrences } from "../recurrence.js";

function iso(dates: readonly Date[]): string[] {
    return dates.map((date) => date.toISOString());
}

const january = {
    start: new Date("2024-01-01T00:00:00Z"),
    end: new Date("2024-06-01T00:00:00Z"),
};

describe("listRecurrenceOccurrences", () => {
    it("includes the start and excludes an occurrence on the end", () => {
        const rule = {
            start: new Date("2026-11-26T09:00:00Z"),
            frequency: "daily" as const,
            count: 2,
        };

        expect(
            iso(
                listRecurrenceOccurrences({ rule: rule, start: new Date("2026-11-26T00:00:00Z"), end: new Date("2026-11-30T00:00:00Z"), }),
            ),
        ).toEqual(["2026-11-26T09:00:00.000Z", "2026-11-27T09:00:00.000Z"]);
        expect(
            listRecurrenceOccurrences({ rule: rule, start: new Date("2026-11-26T09:00:00Z"), end: new Date("2026-11-26T09:00:00Z"), }),
        ).toEqual([]);
        expect(
            iso(
                listRecurrenceOccurrences({ rule: rule, start: new Date("2026-11-27T09:00:00Z"), end: new Date("2026-11-27T09:00:00.001Z"), }),
            ),
        ).toEqual(["2026-11-27T09:00:00.000Z"]);
        expect(
            listRecurrenceOccurrences({ rule: rule, start: new Date("2026-11-26T09:00:00Z"), end: new Date("2026-11-26T09:00:00Z"),, limit: 5, }),
        ).toEqual([]);
    });

    it("lands on leap day and the last day of a short month", () => {
        expect(
            iso(
                listRecurrenceOccurrences(
                    {
                        start: new Date("2024-01-31T00:00:00Z"),
                        frequency: "monthly",
                        byMonthDay: [-1],
                        count: 3,
                    },
                    {
                        between: {
                            start: new Date("2024-01-01T00:00:00Z"),
                            end: new Date("2024-04-01T00:00:00Z"),
                        },
                    },
                ),
            ),
        ).toEqual([
            "2024-01-31T00:00:00.000Z",
            "2024-02-29T00:00:00.000Z",
            "2024-03-31T00:00:00.000Z",
        ]);
        expect(
            iso(
                listRecurrenceOccurrences(
                    {
                        start: new Date("2023-01-31T00:00:00Z"),
                        frequency: "monthly",
                        byMonthDay: [-1],
                        count: 3,
                    },
                    {
                        between: {
                            start: new Date("2023-01-01T00:00:00Z"),
                            end: new Date("2023-04-01T00:00:00Z"),
                        },
                    },
                ),
            ),
        ).toEqual([
            "2023-01-31T00:00:00.000Z",
            "2023-02-28T00:00:00.000Z",
            "2023-03-31T00:00:00.000Z",
        ]);
        expect(
            iso(
                listRecurrenceOccurrences(
                    {
                        start: new Date("2024-01-30T00:00:00Z"),
                        frequency: "monthly",
                        byMonthDay: [30],
                        count: 4,
                    },
                    { between: january },
                ),
            ),
        ).toEqual([
            "2024-01-30T00:00:00.000Z",
            "2024-02-29T00:00:00.000Z",
            "2024-03-30T00:00:00.000Z",
            "2024-04-30T00:00:00.000Z",
        ]);
        expect(
            iso(
                listRecurrenceOccurrences(
                    {
                        start: new Date("2024-02-29T00:00:00Z"),
                        frequency: "yearly",
                        count: 5,
                    },
                    {
                        between: {
                            start: new Date("2024-01-01T00:00:00Z"),
                            end: new Date("2029-01-01T00:00:00Z"),
                        },
                    },
                ),
            ),
        ).toEqual([
            "2024-02-29T00:00:00.000Z",
            "2025-02-28T00:00:00.000Z",
            "2026-02-28T00:00:00.000Z",
            "2027-02-28T00:00:00.000Z",
            "2028-02-29T00:00:00.000Z",
        ]);
    });

    it("keeps 09:00 local time across the New York spring-forward", () => {
        expect(
            iso(
                listRecurrenceOccurrences(
                    {
                        start: new Date("2024-03-09T14:00:00Z"),
                        timeZone: "America/New_York",
                        frequency: "daily",
                        count: 3,
                    },
                    {
                        between: {
                            start: new Date("2024-03-09T00:00:00Z"),
                            end: new Date("2024-03-12T00:00:00Z"),
                        },
                    },
                ),
            ),
        ).toEqual([
            "2024-03-09T14:00:00.000Z",
            "2024-03-10T13:00:00.000Z",
            "2024-03-11T13:00:00.000Z",
        ]);
    });

    it("drops an excluded date and defaults limit to 1000", () => {
        const rule = {
            start: new Date("2026-11-26T09:00:00Z"),
            frequency: "daily" as const,
            count: 3,
            excludedDates: [new Date("2026-11-27T09:00:00Z")],
        };

        expect(
            iso(
                listRecurrenceOccurrences({ rule: rule, start: new Date("2026-11-26T00:00:00Z"), end: new Date("2026-11-30T00:00:00Z"), }),
            ),
        ).toEqual([
            "2026-11-26T09:00:00.000Z",
            "2026-11-28T09:00:00.000Z",
            "2026-11-29T09:00:00.000Z",
        ]);
    });

    it("throws when the interval, limit, or zone is invalid", () => {
        const rule = {
            start: new Date("2026-11-26T09:00:00Z"),
            frequency: "daily" as const,
        };
        const between = {
            start: new Date("2026-11-26T00:00:00Z"),
            end: new Date("2026-12-06T00:00:00Z"),
        };

        expect(() =>
            listRecurrenceOccurrences(rule, { between, limit: 3 }),
        ).toThrow(RangeError);
        expect(() =>
            listRecurrenceOccurrences(rule, { between, limit: 0 }),
        ).toThrow(RangeError);
        expect(() =>
            listRecurrenceOccurrences(rule, { between, limit: 1.5 }),
        ).toThrow(RangeError);
        expect(() =>
            listRecurrenceOccurrences({ rule: rule, start: new Date("2026-12-01T00:00:00Z"), end: new Date("2026-11-01T00:00:00Z"), }),
        ).toThrow(RangeError);
        expect(() =>
            listRecurrenceOccurrences(
                { ...rule, timeZone: "Mars/Base" },
                { between },
            ),
        ).toThrow(RangeError);
    });
});
