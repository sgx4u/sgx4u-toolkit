import { describe, expect, it } from "vitest";
import { isWithinInterval } from "../index.js";

describe("isWithinInterval", () => {
    const interval = {
        start: new Date("2026-01-01T00:00:00Z"),
        end: new Date("2026-01-02T00:00:00Z"),
    };

    it("includes the start and excludes the end", () => {
        expect(
            isWithinInterval({ date: "2026-01-01T00:00:00Z", interval }),
        ).toBe(true);
        expect(
            isWithinInterval({ date: "2026-01-01T23:59:59.999Z", interval }),
        ).toBe(true);
        expect(
            isWithinInterval({ date: "2026-01-02T00:00:00Z", interval }),
        ).toBe(false);
        expect(
            isWithinInterval({ date: "2025-12-31T23:59:59.999Z", interval }),
        ).toBe(false);
        expect(isWithinInterval({ date: interval.start, interval })).toBe(true);
        expect(
            isWithinInterval({
                date: 0,
                interval: {
                    start: new Date(-1),
                    end: new Date(1),
                },
            }),
        ).toBe(true);
    });

    it("covers leap day, month end, and the year bounds", () => {
        expect(
            isWithinInterval({
                date: "2024-02-29T12:00:00Z",
                interval: {
                    start: new Date("2024-02-28T00:00:00Z"),
                    end: new Date("2024-03-01T00:00:00Z"),
                },
            }),
        ).toBe(true);
        expect(
            isWithinInterval({
                date: "2024-03-01T00:00:00Z",
                interval: {
                    start: new Date("2024-02-28T00:00:00Z"),
                    end: new Date("2024-03-01T00:00:00Z"),
                },
            }),
        ).toBe(false);
        expect(
            isWithinInterval({
                date: "2026-01-31T23:59:59Z",
                interval: {
                    start: new Date("2026-01-31T00:00:00Z"),
                    end: new Date("2026-02-01T00:00:00Z"),
                },
            }),
        ).toBe(true);
        expect(
            isWithinInterval({
                date: "0000-01-01T00:00:00Z",
                interval: {
                    start: new Date("0000-01-01T00:00:00Z"),
                    end: new Date("0000-01-02T00:00:00Z"),
                },
            }),
        ).toBe(true);
        expect(
            isWithinInterval({
                date: "9999-12-31T23:59:59.999Z",
                interval: {
                    start: new Date("9999-12-31T00:00:00Z"),
                    end: new Date("9999-12-31T23:59:59.999Z"),
                },
            }),
        ).toBe(false);
        expect(
            isWithinInterval({
                date: "9999-12-31T23:59:59.998Z",
                interval: {
                    start: new Date("9999-12-31T00:00:00Z"),
                    end: new Date("9999-12-31T23:59:59.999Z"),
                },
            }),
        ).toBe(true);
    });

    it("returns false for an empty interval", () => {
        const instant = new Date("2026-06-15T12:00:00Z");

        expect(
            isWithinInterval({
                date: instant,
                interval: { start: instant, end: instant },
            }),
        ).toBe(false);
        expect(
            isWithinInterval({
                date: "0000-02-29T00:00:00Z",
                interval: {
                    start: new Date("0000-02-29T00:00:00Z"),
                    end: new Date("0000-02-29T00:00:00Z"),
                },
            }),
        ).toBe(false);
    });

    it("throws when the date or the interval is invalid", () => {
        expect(isWithinInterval({ date: "2024-02-30", interval })).toBe(false);
        expect(isWithinInterval({ date: new Date(Number.NaN), interval })).toBe(
            false,
        );
        expect(
            isWithinInterval({ date: null as unknown as string, interval }),
        ).toBe(false);
        expect(
            isWithinInterval({
                date: "2026-01-01T00:00:00Z",
                interval: {
                    start: new Date("2026-01-02T00:00:00Z"),
                    end: new Date("2026-01-01T00:00:00Z"),
                },
            }),
        ).toBe(false);
        expect(
            isWithinInterval({
                date: "2026-01-01T00:00:00Z",
                interval: null as unknown as never,
            }),
        ).toBe(false);
    });
});
