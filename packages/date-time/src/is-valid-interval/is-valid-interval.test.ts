import { describe, expect, it } from "vitest";
import { isValidInterval } from "../index.js";

describe("isValidInterval", () => {
    it("accepts a half-open interval", () => {
        expect(isValidInterval({ start: new Date(0), end: new Date(1) })).toBe(
            true,
        );
    });

    it("accepts an empty interval and rejects an end before the start", () => {
        expect(
            isValidInterval({
                start: new Date("2026-11-26T00:00:00.000Z"),
                end: new Date("2026-11-26T00:00:00.000Z"),
            }),
        ).toBe(true);
        expect(isValidInterval({ start: 0, end: 0 })).toBe(true);
        expect(
            isValidInterval({
                start: "2026-01-01T00:00:00Z",
                end: "2026-01-02T00:00:00Z",
            }),
        ).toBe(true);
        expect(isValidInterval({ start: new Date(1), end: new Date(0) })).toBe(
            false,
        );
    });

    it("returns false and does not throw for a value that is not an interval", () => {
        const rejected = [
            null,
            undefined,
            "2026-01-01/2026-01-02",
            {},
            { start: new Date(0) },
            { end: new Date(1) },
            { start: new Date(Number.NaN), end: new Date(1) },
            { start: "nope", end: "2026-01-02T00:00:00Z" },
            [],
        ];
        for (const value of rejected) {
            expect(() => isValidInterval(value)).not.toThrow();
            expect(isValidInterval(value)).toBe(false);
        }
    });

    it("accepts numeric timestamps in either order only when the end is not earlier", () => {
        expect(isValidInterval({ start: 10, end: 20 })).toBe(true);
        expect(isValidInterval({ start: 20, end: 10 })).toBe(false);
    });
});
