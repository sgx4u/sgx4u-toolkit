import { describe, expect, it } from "vitest";
import { describeRecurrenceRule } from "../recurrence.js";

describe("describeRecurrenceRule", () => {
    it("names an every-other-week Monday and Friday schedule", () => {
        expect(
            describeRecurrenceRule({
                start: new Date("2026-11-26T09:00:00Z"),
                frequency: "weekly",
                interval: 2,
                byWeekday: [{ weekday: 1 }, { weekday: 5 }],
            }),
        ).toBe("Every 2 weeks on Monday and Friday");
    });

    it("defaults the interval to 1 and still describes a leap-day yearly rule as every year", () => {
        expect(
            describeRecurrenceRule({
                start: new Date("2024-02-29T00:00:00Z"),
                frequency: "yearly",
            }),
        ).toBe("Every year");
        expect(
            describeRecurrenceRule({
                start: new Date("2026-01-01T00:00:00Z"),
                frequency: "daily",
            }),
        ).toBe("Every day");
        expect(
            describeRecurrenceRule({
                start: new Date("2025-12-31T00:00:00Z"),
                frequency: "monthly",
                interval: 3,
            }),
        ).toBe("Every 3 months");
    });

    it("throws when the rule is missing", () => {
        expect(() => describeRecurrenceRule(null as never)).toThrow(TypeError);
    });
});
