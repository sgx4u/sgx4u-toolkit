import { describe, expect, it } from "vitest";
import { formatDuration } from "../index.js";

describe("formatDuration", () => {
    it("writes a long English list by default", () => {
        expect(
            formatDuration({
                duration: { hours: 1, minutes: 30 },
                locale: "en",
            }),
        ).toBe("1 hour, 30 minutes");
        expect(
            formatDuration({
                duration: { hours: 1, minutes: 30 },
                locale: "en",
                style: "long",
            }),
        ).toBe("1 hour, 30 minutes");
        expect(formatDuration({ duration: { hours: -1 }, locale: "en" })).toBe(
            "-1 hour",
        );
        expect(formatDuration({ duration: {}, locale: "en" })).toBe(
            "0 seconds",
        );
    });

    it("shortens the units and uses a clock for digital style", () => {
        expect(
            formatDuration({
                duration: { hours: 1, minutes: 30 },
                locale: "en",
                style: "short",
            }),
        ).toBe("1 hr, 30 min");
        const digital = formatDuration({
            duration: { hours: 1, minutes: 2, seconds: 3 },
            style: "digital",
        });
        const durationFormat = (Intl as { DurationFormat?: unknown })
            .DurationFormat;
        expect(digital).toBe(
            durationFormat === undefined ? "01:02:03" : "1:02:03",
        );
        expect(
            formatDuration({
                duration: { days: 366 },
                locale: "en",
                style: "long",
            }),
        ).toBe("366 days");
    });

    it("rejects an unknown style and a value that is not a duration", () => {
        expect(() =>
            formatDuration({ duration: { hours: 1 }, style: "wide" as "long" }),
        ).toThrow(RangeError);
        expect(() =>
            formatDuration({ duration: { hours: 1 }, style: "wide" as "long" }),
        ).toThrow(
            '`style` must be "long", "short", "narrow", or "digital"; received "wide".',
        );
        expect(formatDuration({ duration: null as never })).toBeUndefined();
        expect(
            formatDuration({ duration: { hours: 1, days: -1 } }),
        ).toBeUndefined();
    });
});
