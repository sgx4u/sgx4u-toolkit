import { describe, expect, it } from "vitest";
import { formatDurationCompact } from "../index.js";

describe("formatDurationCompact", () => {
    it("writes the two largest units separated by a space", () => {
        expect(
            formatDurationCompact({ duration: { hours: 1, minutes: 30 } }),
        ).toBe("1h 30m");
        expect(
            formatDurationCompact({
                duration: { hours: 1, minutes: 30 },
                maximumUnitCount: 2,
                separator: " ",
            }),
        ).toBe("1h 30m");
        expect(formatDurationCompact({ duration: 5_400_000 })).toBe("1h 30m");
        expect(formatDurationCompact({ duration: 0 })).toBe("0s");
        expect(formatDurationCompact({ duration: {} })).toBe("0s");
    });

    it("stops after the default two units and keeps a custom separator", () => {
        expect(
            formatDurationCompact({
                duration: { days: 1, hours: 2, minutes: 3 },
            }),
        ).toBe("1d 2h");
        expect(
            formatDurationCompact({
                duration: { days: 366, hours: 1 },
                separator: ", ",
            }),
        ).toBe("366d, 1h");
        expect(
            formatDurationCompact({ duration: { hours: -1, minutes: -30 } }),
        ).toBe("-1h -30m");
        expect(
            formatDurationCompact({ duration: { years: 1, months: 1 } }),
        ).toBe("1y 1mo");
    });

    it("rejects a non-positive unit count and a mixed-sign duration", () => {
        expect(() =>
            formatDurationCompact({
                duration: { hours: 1 },
                maximumUnitCount: 0,
            }),
        ).toThrow(RangeError);
        expect(() =>
            formatDurationCompact({
                duration: { hours: 1 },
                maximumUnitCount: 0,
            }),
        ).toThrow("`maximumUnitCount` must be a positive integer; received 0.");
        expect(
            formatDurationCompact({ duration: { hours: 1, days: -1 } }),
        ).toBeUndefined();
        expect(
            formatDurationCompact({ duration: "1" as never }),
        ).toBeUndefined();
    });
});
