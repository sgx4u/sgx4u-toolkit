import { describe, expect, it } from "vitest";
import { describeCronExpression, parseCronExpression } from "../cron.js";

describe("describeCronExpression", () => {
    it("describes a weekday office schedule in 12-hour time by default", () => {
        expect(describeCronExpression({ schedule: "0 9 * * 1-5" })).toBe(
            "At 09:00 AM, Monday through Friday",
        );
        expect(
            describeCronExpression({
                schedule: "0 9 * * 1-5",
                hourCycle: "h12",
            }),
        ).toBe("At 09:00 AM, Monday through Friday");
        const parsed = parseCronExpression({ expression: "0 9 * * 1-5" });
        expect(parsed).toBeDefined();
        if (parsed !== undefined) {
            expect(describeCronExpression({ schedule: parsed })).toBe(
                "At 09:00 AM, Monday through Friday",
            );
        }
    });

    it("writes midnight on leap day and the first morning of the year", () => {
        expect(describeCronExpression({ schedule: "0 0 29 2 *" })).toBe(
            "At 12:00 AM",
        );
        expect(describeCronExpression({ schedule: "0 0 1 1 *" })).toBe(
            "At 12:00 AM",
        );
        expect(describeCronExpression({ schedule: "0 0 * * 0" })).toBe(
            "At 12:00 AM, Sunday",
        );
    });

    it("uses 24-hour time when hourCycle is h23 and returns an empty string for text that does not parse", () => {
        expect(
            describeCronExpression({
                schedule: "0 9 * * 1-5",
                hourCycle: "h23",
            }),
        ).toBe("At 09:00, Monday through Friday");
        expect(describeCronExpression({ schedule: "not a cron" })).toBe("");
        expect(describeCronExpression({ schedule: "" })).toBe("");
    });

    it("rejects an unknown hour cycle", () => {
        expect(() =>
            describeCronExpression({
                schedule: "0 9 * * *",
                hourCycle: "h24" as "h12",
            }),
        ).toThrow(RangeError);
        expect(() =>
            describeCronExpression({
                schedule: "0 9 * * *",
                hourCycle: "h24" as "h12",
            }),
        ).toThrow('`hourCycle` must be "h12" or "h23"; received "h24".');
    });
});
