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
        expect(doIntervalsOverlap({ first: first, second: second })).toBe(
            false,
        );
        expect(
            doIntervalsOverlap({
                first: first,
                second: second,
                countTouchingAsOverlap: false,
            }),
        ).toBe(false);
        expect(
            doIntervalsOverlap({
                first: first,
                second: second,
                countTouchingAsOverlap: true,
            }),
        ).toBe(true);
        expect(doIntervalsOverlap({ first: first, second: first })).toBe(true);
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
        expect(doIntervalsOverlap({ first: leapDay, second: march })).toBe(
            true,
        );
        const lastDay = {
            start: new Date("2024-12-31T00:00:00Z"),
            end: new Date("2025-01-01T00:00:00Z"),
        };
        const newYear = {
            start: new Date("2025-01-01T00:00:00Z"),
            end: new Date("2025-01-02T00:00:00Z"),
        };
        expect(doIntervalsOverlap({ first: lastDay, second: newYear })).toBe(
            false,
        );
        const empty = {
            start: new Date(0),
            end: new Date(0),
        };
        expect(doIntervalsOverlap({ first: empty, second: empty })).toBe(false);
        expect(
            doIntervalsOverlap({
                first: empty,
                second: empty,
                countTouchingAsOverlap: true,
            }),
        ).toBe(true);
    });

    it("returns undefined when an interval is invalid", () => {
        expect(
            doIntervalsOverlap({
                first: { start: new Date(5), end: new Date(1) },
                second: { start: new Date(0), end: new Date(2) },
            }),
        ).toBeUndefined();
    });
});
