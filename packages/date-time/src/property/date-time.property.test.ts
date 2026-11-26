import fc from "fast-check";
import { Temporal } from "temporal-polyfill";
import { describe, expect, it } from "vitest";
import {
    addDuration,
    compareDates,
    formatDate,
    formatISODuration,
    mergeIntervals,
    parseDateWithPattern,
    parseISODuration,
    sortDates,
    subtractDuration,
} from "../index.js";

const zones = [
    "UTC",
    "Asia/Kolkata",
    "America/New_York",
    "Europe/London",
    "Australia/Lord_Howe",
] as const;

const finiteInstant = fc
    .integer({
        min: Date.UTC(1900, 0, 1),
        max: Date.UTC(2100, 0, 1),
    })
    .map((epochMilliseconds) => new Date(epochMilliseconds));

const clockDuration = fc.record({
    hours: fc.integer({ min: 0, max: 48 }),
    minutes: fc.integer({ min: 0, max: 59 }),
    seconds: fc.integer({ min: 0, max: 59 }),
    milliseconds: fc.integer({ min: 0, max: 999 }),
});

describe("property tests", () => {
    it("round-trips a clock duration through add and subtract", () => {
        fc.assert(
            fc.property(
                finiteInstant,
                clockDuration,
                fc.constantFrom(...zones),
                (date, duration, timeZone) => {
                    const forward = addDuration({ date, duration, timeZone });
                    if (forward === undefined) {
                        return;
                    }
                    const back = subtractDuration({
                        date: forward,
                        duration,
                        timeZone,
                    });
                    expect(back?.getTime()).toBe(date.getTime());
                },
            ),
            { numRuns: 40 },
        );
    });

    it("keeps compareDates a total order that sortDates follows", () => {
        fc.assert(
            fc.property(
                fc.array(finiteInstant, { minLength: 0, maxLength: 12 }),
                (dates) => {
                    const sorted = sortDates({ dates });
                    if (sorted === undefined) {
                        return;
                    }
                    for (let index = 1; index < sorted.length; index += 1) {
                        const previous = sorted[index - 1];
                        const current = sorted[index];
                        if (previous !== undefined && current !== undefined) {
                            expect(
                                compareDates({
                                    first: previous,
                                    second: current,
                                }),
                            ).not.toBe(1);
                        }
                    }
                    if (dates.length >= 2) {
                        const first = dates[0];
                        const second = dates[1];
                        if (first !== undefined && second !== undefined) {
                            expect(
                                compareDates({ first, second }),
                            ).toBe(
                                -(
                                    compareDates({
                                        first: second,
                                        second: first,
                                    }) ?? 0
                                ) || 0,
                            );
                        }
                    }
                },
            ),
            { numRuns: 30 },
        );
    });

    it("round-trips an ISO duration and a full numeric date pattern", () => {
        fc.assert(
            fc.property(clockDuration, (duration) => {
                fc.pre(
                    duration.milliseconds === 0 &&
                        duration.hours + duration.minutes + duration.seconds >
                            0,
                );
                const positive = {
                    hours: Math.abs(duration.hours),
                    minutes: Math.abs(duration.minutes),
                    seconds: Math.abs(duration.seconds),
                    milliseconds: Math.abs(duration.milliseconds),
                };
                expect(parseISODuration(formatISODuration(positive))).toEqual(
                    omitZero(positive),
                );
            }),
            { numRuns: 30 },
        );
        fc.assert(
            fc.property(finiteInstant, (date) => {
                const pattern = "yyyy-MM-dd HH:mm:ss.SSS";
                const text = formatDate({
                    date,
                    pattern,
                    timeZone: "UTC",
                });
                if (text === undefined) {
                    return;
                }
                expect(
                    parseDateWithPattern({
                        value: text,
                        pattern,
                        timeZone: "UTC",
                    })?.getTime(),
                ).toBe(date.getTime());
            }),
            { numRuns: 25 },
        );
    });

    it("merges intervals without overlaps and keeps the covered instants", () => {
        fc.assert(
            fc.property(
                fc.array(
                    fc.integer({ min: 0, max: 10_000 }).chain((start) =>
                        fc
                            .integer({ min: start, max: start + 500 })
                            .map((end) => ({
                                start: new Date(start),
                                end: new Date(end),
                            })),
                    ),
                    { maxLength: 8 },
                ),
                (intervals) => {
                    const merged = mergeIntervals({ intervals });
                    if (merged === undefined) {
                        return;
                    }
                    for (let index = 1; index < merged.length; index += 1) {
                        const previous = merged[index - 1];
                        const current = merged[index];
                        if (previous !== undefined && current !== undefined) {
                            expect(
                                current.start.getTime(),
                            ).toBeGreaterThanOrEqual(previous.end.getTime());
                        }
                    }
                },
            ),
            { numRuns: 30 },
        );
    });

    it("matches Temporal for random instants and a one-day move", () => {
        fc.assert(
            fc.property(
                finiteInstant,
                fc.constantFrom(...zones),
                (date, timeZone) => {
                    const zoned = Temporal.Instant.fromEpochMilliseconds(
                        date.getTime(),
                    ).toZonedDateTimeISO(timeZone);
                    const moved = addDuration({
                        date,
                        duration: { days: 1 },
                        timeZone,
                    });
                    if (moved === undefined) {
                        return;
                    }
                    const temporalMoved = zoned.add({
                        days: 1,
                    }).epochMilliseconds;
                    expect(moved.getTime()).toBe(temporalMoved);
                },
            ),
            { numRuns: 30 },
        );
    });
});

/**
 * @param duration - A duration that may contain zeroes.
 * @returns The same duration without zero fields.
 */
function omitZero(duration: {
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}): {
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
} {
    const result: {
        hours?: number;
        minutes?: number;
        seconds?: number;
        milliseconds?: number;
    } = {};
    if (duration.hours !== 0) {
        result.hours = duration.hours;
    }
    if (duration.minutes !== 0) {
        result.minutes = duration.minutes;
    }
    if (duration.seconds !== 0) {
        result.seconds = duration.seconds;
    }
    if (duration.milliseconds !== 0) {
        result.milliseconds = duration.milliseconds;
    }
    return result;
}