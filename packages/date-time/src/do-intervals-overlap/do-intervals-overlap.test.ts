import { describe, expect, it } from "vitest";
import { doIntervalsOverlap } from "../index.js";

describe("doIntervalsOverlap", () => {
    it("treats a shared endpoint as disjoint unless touching counts", () => {
        const first = {
            start: new Date("2026-01-01T00:00:00Z"),
            end: new Date("2026-01-02T00:00:00Z"),
        };
        const second = {
            start: new Date("2026-01-02T00:00:00Z"),
            end: new Date("2026-01-03T00:00:00Z"),
        };
        expect(doIntervalsOverlap(first, second)).toBe(false);
        expect(
            doIntervalsOverlap(first, second, {
                countTouchingAsOverlap: false,
            }),
        ).toBe(false);
        expect(
            doIntervalsOverlap(first, second, { countTouchingAsOverlap: true }),
        ).toBe(true);
        expect(doIntervalsOverlap(first, first)).toBe(true);
    });

    it("overlaps a leap day with March and keeps a year boundary that only touches disjoint", () => {
        const leapDay = {
            start: new Date("2024-02-29T00:00:00Z"),
            end: new Date("2024-03-01T00:00:00Z"),
        };
        const march = {
            start: new Date("2024-02-29T12:00:00Z"),
            end: new Date("2024-03-02T00:00:00Z"),
        };
        expect(doIntervalsOverlap(leapDay, march)).toBe(true);
        const lastDay = {
            start: new Date("2024-12-31T00:00:00Z"),
            end: new Date("2025-01-01T00:00:00Z"),
        };
        const newYear = {
            start: new Date("2025-01-01T00:00:00Z"),
            end: new Date("2025-01-02T00:00:00Z"),
        };
        expect(doIntervalsOverlap(lastDay, newYear)).toBe(false);
        const empty = {
            start: new Date(0),
            end: new Date(0),
        };
        expect(doIntervalsOverlap(empty, empty)).toBe(false);
        expect(
            doIntervalsOverlap(empty, empty, { countTouchingAsOverlap: true }),
        ).toBe(true);
    });

    it("rejects an interval whose end is before its start", () => {
        expect(() =>
            doIntervalsOverlap(
                { start: new Date(5), end: new Date(1) },
                { start: new Date(0), end: new Date(2) },
            ),
        ).toThrow(RangeError);
        expect(() =>
            doIntervalsOverlap(
                { start: new Date(5), end: new Date(1) },
                { start: new Date(0), end: new Date(2) },
            ),
        ).toThrow(
            "`first` must be an interval whose end is not before its start; received [object Object].",
        );
    });
});
