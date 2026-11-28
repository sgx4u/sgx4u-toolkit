import { describe, expect, it } from "vitest";
import { createAstronomy } from "./create-astronomy.js";
import { createCron } from "./create-cron.js";
import { createNaturalLanguage } from "./create-natural-language.js";
import { createRecurrence } from "./create-recurrence.js";

describe("subpath factories", () => {
    it("binds the same config without sharing state", () => {
        const utc = createRecurrence({ timeZone: "UTC" });
        const rule = {
            start: new Date("2026-06-15T09:00:00Z"),
            frequency: "daily" as const,
        };
        expect(
            utc.getNextRecurrenceOccurrence({
                rule,
                now: "2026-06-15T09:00:00Z",
            }),
        ).toBeInstanceOf(Date);
        const parsed = utc.parseRecurrenceRule(
            "DTSTART:20260615T090000Z\nRRULE:FREQ=DAILY",
        );
        expect(parsed?.frequency).toBe("daily");
        expect(utc.describeRecurrenceRule(rule).length).toBeGreaterThan(0);
        expect(
            utc.listRecurrenceOccurrences({
                rule,
                start: "2026-06-15T00:00:00Z",
                end: "2026-06-17T00:00:00Z",
            }).length,
        ).toBeGreaterThan(0);

        const cron = createCron({ timeZone: "UTC" });
        const nextRuns = cron.getNextCronRuns({
            schedule: "0 9 * * *",
            now: "2026-06-15T08:00:00Z",
        });
        expect(nextRuns?.[0]?.toISOString()).toBe("2026-06-15T09:00:00.000Z");
        expect(cron.isValidCronExpression({ expression: "@daily" })).toBe(true);
        expect(
            cron.parseCronExpression({ expression: "@daily" }),
        ).toBeDefined();
        expect(
            cron.doesCronMatch({
                schedule: "0 9 * * *",
                date: "2026-06-15T09:00:00Z",
            }),
        ).toBe(true);
        expect(
            cron.describeCronExpression({ schedule: "0 9 * * *" }).length,
        ).toBeGreaterThan(0);
        const previousRuns = cron.getPreviousCronRuns({
            schedule: "0 9 * * *",
            now: "2026-06-15T10:00:00Z",
        });
        expect(previousRuns?.length ?? 0).toBeGreaterThan(0);

        const english = createNaturalLanguage({
            timeZone: "UTC",
            now: () => new Date("2026-06-15T12:00:00Z"),
        });
        expect(
            english.parseNaturalDate({ text: "tomorrow" })?.toISOString(),
        ).toBe("2026-06-16T00:00:00.000Z");
        expect(
            english.parseNaturalDateRange({
                text: "from Monday to Wednesday",
            }),
        ).toBeDefined();
        expect(english.findDatesInText({ text: "Meet tomorrow" }).length).toBe(
            1,
        );

        const astronomy = createAstronomy({ timeZone: "UTC" });
        expect(
            astronomy.getMoonPhase("2026-06-15T00:00:00Z")?.name,
        ).toBeTruthy();
        expect(
            astronomy.getSunTimes({
                date: "2024-03-20",
                location: { latitude: 0, longitude: 0 },
            })?.sunrise,
        ).toBeInstanceOf(Date);
    });

    it("throws when a subpath config is invalid", () => {
        expect(() => createCron({ timeZone: "Not/AZone" })).toThrow(RangeError);
        expect(() => createNaturalLanguage({ weekStartsOn: 9 as 1 })).toThrow(
            RangeError,
        );
    });
});
