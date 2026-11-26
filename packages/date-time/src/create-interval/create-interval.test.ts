import { describe, expect, it } from "vitest";
import { createInterval } from "../index.js";

describe("createInterval", () => {
    it("builds a half-open interval without reusing the input dates", () => {
        const start = new Date("2026-01-01T00:00:00Z");
        const end = new Date("2026-01-02T00:00:00Z");
        const interval = createInterval({ start, end });
        expect(interval?.start).not.toBe(start);
        expect(interval?.end).not.toBe(end);
        expect(interval?.start.toISOString()).toBe("2026-01-01T00:00:00.000Z");
        expect(interval?.end.toISOString()).toBe("2026-01-02T00:00:00.000Z");
        expect(start.toISOString()).toBe("2026-01-01T00:00:00.000Z");
    });

    it("allows an empty interval and spans a leap day into the next year", () => {
        const leapDay = new Date("2024-02-29T00:00:00Z");
        const empty = createInterval({ start: leapDay, end: leapDay });
        expect(empty?.start.getTime()).toBe(empty?.end.getTime());
        expect(empty?.start).not.toBe(leapDay);
        const intoMarch = createInterval({
            start: "2024-02-29T00:00:00Z",
            end: "2024-03-01T00:00:00Z",
        });
        expect(intoMarch).toBeDefined();
        expect(
            (intoMarch?.end.getTime() ?? 0) - (intoMarch?.start.getTime() ?? 0),
        ).toBe(86_400_000);
        const yearBoundary = createInterval({
            start: "2024-12-31T00:00:00Z",
            end: "2025-01-01T00:00:00Z",
        });
        expect(yearBoundary?.start.toISOString()).toBe(
            "2024-12-31T00:00:00.000Z",
        );
        expect(yearBoundary?.end.toISOString()).toBe(
            "2025-01-01T00:00:00.000Z",
        );
    });

    it("returns undefined for an inverted interval or a date that does not parse", () => {
        expect(createInterval({ start: 10, end: 0 })).toBeUndefined();
        expect(
            createInterval({
                start: "nope",
                end: "2024-01-02T00:00:00Z",
            }),
        ).toBeUndefined();
    });
});
