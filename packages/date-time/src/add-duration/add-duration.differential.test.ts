import { Temporal } from "temporal-polyfill";
import { describe, expect, it } from "vitest";
import {
    addDurationToInstant,
    differenceInInstantUnit,
    durationBetweenInstants,
    roundInstant,
    startOfInstant,
} from "../utils/arithmetic.utils.js";
import { readDateParts } from "../utils/time-zone.utils.js";

const zones = [
    "UTC",
    "Asia/Kolkata",
    "America/New_York",
    "Europe/London",
    "America/Santiago",
    "Australia/Lord_Howe",
    "Pacific/Chatham",
] as const;

describe("arithmetic against Temporal", () => {
    it("matches create, add, start, difference, and round on fixed instants", () => {
        const instants = [
            Date.UTC(2024, 0, 31, 15, 0, 0),
            Date.UTC(2024, 2, 10, 6, 30, 0),
            Date.UTC(2024, 10, 3, 6, 30, 0),
            Date.UTC(2026, 1, 28, 18, 30, 0),
            Date.UTC(1904, 5, 1, 17, 32, 11),
            Date.UTC(2024, 8, 8, 3, 30, 0),
        ];
        for (const timeZone of zones) {
            for (const instant of instants) {
                const zoned =
                    Temporal.Instant.fromEpochMilliseconds(
                        instant,
                    ).toZonedDateTimeISO(timeZone);
                expect(readDateParts(instant, timeZone).year).toBe(zoned.year);
                expect(readDateParts(instant, timeZone).month).toBe(
                    zoned.month,
                );
                expect(readDateParts(instant, timeZone).day).toBe(zoned.day);
                expect(readDateParts(instant, timeZone).hour).toBe(zoned.hour);
                expect(
                    readDateParts(instant, timeZone).offsetMinutes,
                ).toBeCloseTo(zoned.offsetNanoseconds / 60_000_000_000, 6);

                const added = addDurationToInstant(
                    instant,
                    { months: 1, days: 1, hours: 3 },
                    timeZone,
                    "compatible",
                    "constrain",
                );
                const temporalAdded = zoned.add({
                    months: 1,
                    days: 1,
                    hours: 3,
                }).epochMilliseconds;
                expect(added).toBe(temporalAdded);

                const started = startOfInstant(instant, "day", timeZone, 1);
                expect(started).toBe(zoned.startOfDay().epochMilliseconds);

                const monthStart = startOfInstant(
                    instant,
                    "month",
                    timeZone,
                    1,
                );
                expect(monthStart).toBe(
                    zoned.with({
                        day: 1,
                        hour: 0,
                        minute: 0,
                        second: 0,
                        millisecond: 0,
                    }).epochMilliseconds,
                );
            }
        }
    });

    it("round-trips a duration between two instants", () => {
        const earlier = Date.UTC(2024, 0, 31, 10, 15, 30, 250);
        const later = Date.UTC(2026, 2, 10, 7, 30, 0, 0);
        for (const timeZone of zones) {
            const duration = durationBetweenInstants(
                later,
                earlier,
                timeZone,
                "year",
                "millisecond",
            );
            const added = addDurationToInstant(
                earlier,
                duration,
                timeZone,
                "compatible",
                "constrain",
            );
            expect(added).toBe(later);
            expect(
                differenceInInstantUnit(
                    later,
                    earlier,
                    "hour",
                    timeZone,
                    "truncate",
                ),
            ).toBe(Math.trunc((later - earlier) / 3_600_000));
        }
    });

    it("rounds 10:07:30 up to the next 15 minutes", () => {
        const instant = Date.UTC(2024, 5, 15, 10, 7, 30);
        expect(roundInstant(instant, "minute", "UTC", 1, 15, "nearest")).toBe(
            Date.UTC(2024, 5, 15, 10, 15, 0),
        );
        expect(roundInstant(instant, "minute", "UTC", 1, 15, "down")).toBe(
            Date.UTC(2024, 5, 15, 10, 0, 0),
        );
    });
});
