import { describe, expect, it } from "vitest";
import { isWithinNext } from "../index.js";

describe("isWithinNext", () => {
    it("includes now and the far end of the window", () => {
        const options = {
            now: "2026-01-01T00:00:00Z",
            timeZone: "UTC",
        };

        expect(
            isWithinNext("2026-01-01T00:00:00Z", { hours: 24 }, options),
        ).toBe(true);
        expect(
            isWithinNext("2026-01-02T00:00:00Z", { hours: 24 }, options),
        ).toBe(true);
        expect(
            isWithinNext("2025-12-31T23:59:59.999Z", { hours: 24 }, options),
        ).toBe(false);
        expect(
            isWithinNext("2026-01-02T00:00:00.001Z", { hours: 24 }, options),
        ).toBe(false);
        expect(isWithinNext(options.now, {}, options)).toBe(true);
        expect(isWithinNext("2026-01-01T00:00:00.001Z", {}, options)).toBe(
            false,
        );
    });

    it("clamps month and year steps on leap day and month end", () => {
        expect(
            isWithinNext(
                "2024-02-29T00:00:00Z",
                { months: 1 },
                {
                    now: "2024-01-31T00:00:00Z",
                    timeZone: "UTC",
                },
            ),
        ).toBe(true);
        expect(
            isWithinNext(
                "2024-03-01T00:00:00Z",
                { months: 1 },
                {
                    now: "2024-01-31T00:00:00Z",
                    timeZone: "UTC",
                },
            ),
        ).toBe(false);
        expect(
            isWithinNext(
                "2026-02-28T00:00:00Z",
                { months: 1 },
                {
                    now: "2026-01-31T00:00:00Z",
                    timeZone: "UTC",
                },
            ),
        ).toBe(true);
        expect(
            isWithinNext(
                "2026-03-01T00:00:00Z",
                { months: 1 },
                {
                    now: "2026-01-31T00:00:00Z",
                    timeZone: "UTC",
                },
            ),
        ).toBe(false);
        expect(
            isWithinNext(
                "2024-02-28T00:00:00Z",
                { years: 1 },
                {
                    now: "2023-02-28T00:00:00Z",
                    timeZone: "UTC",
                },
            ),
        ).toBe(true);
        expect(
            isWithinNext(
                "2024-02-29T00:00:00Z",
                { years: 1 },
                {
                    now: "2023-02-28T00:00:00Z",
                    timeZone: "UTC",
                },
            ),
        ).toBe(false);
        expect(
            isWithinNext(
                "0000-02-29T00:00:00Z",
                { days: 1 },
                {
                    now: "0000-02-28T00:00:00Z",
                    timeZone: "UTC",
                },
            ),
        ).toBe(true);
        expect(
            isWithinNext(
                "9999-12-31T00:00:00Z",
                { days: 1 },
                {
                    now: "9999-12-30T00:00:00Z",
                    timeZone: "UTC",
                },
            ),
        ).toBe(true);
    });

    it("keeps wall-clock days across the New York spring-forward", () => {
        const now = {
            now: "2024-03-09T14:00:00Z",
            timeZone: "America/New_York",
        };

        expect(isWithinNext("2024-03-10T13:00:00Z", { days: 1 }, now)).toBe(
            true,
        );
        expect(isWithinNext("2024-03-10T13:00:00.001Z", { days: 1 }, now)).toBe(
            false,
        );
        expect(isWithinNext("2024-03-10T14:00:00Z", { hours: 24 }, now)).toBe(
            true,
        );
        expect(isWithinNext("2024-03-10T14:00:00Z", { days: 1 }, now)).toBe(
            false,
        );
        expect(
            isWithinNext(
                "2024-03-10T14:00:00Z",
                { days: 1 },
                {
                    now: "2024-03-09T14:00:00Z",
                    timeZone: "UTC",
                },
            ),
        ).toBe(true);
    });

    it("throws when the duration is negative or an argument is invalid", () => {
        const options = { now: "2026-01-01T00:00:00Z", timeZone: "UTC" };

        expect(() => isWithinNext(options.now, { hours: -1 }, options)).toThrow(
            RangeError,
        );
        expect(() =>
            isWithinNext(
                options.now,
                [] as unknown as { hours: number },
                options,
            ),
        ).toThrow(TypeError);
        expect(() => isWithinNext("nope", { days: 1 }, options)).toThrow(
            RangeError,
        );
        expect(() =>
            isWithinNext(null as unknown as string, { days: 1 }, options),
        ).toThrow(TypeError);
        expect(() =>
            isWithinNext(options.now, { days: 1 }, { timeZone: "Mars/Base" }),
        ).toThrow(RangeError);
    });
});
