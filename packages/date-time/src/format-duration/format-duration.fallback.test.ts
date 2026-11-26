import { afterEach, describe, expect, it } from "vitest";
import { formatDuration } from "../index.js";

const intlWithDuration = Intl as unknown as { DurationFormat?: unknown };
const originalDurationFormat = intlWithDuration.DurationFormat;

afterEach(() => {
    if (originalDurationFormat === undefined) {
        delete intlWithDuration.DurationFormat;
    } else {
        intlWithDuration.DurationFormat = originalDurationFormat;
    }
});

describe("formatDuration without Intl.DurationFormat", () => {
    it("joins unit names and uses the clock form for digital style", () => {
        delete intlWithDuration.DurationFormat;
        expect(
            formatDuration({
                duration: { hours: 1, minutes: 30 },
                locale: "en",
            }),
        ).toMatch(/1 hour/);
        expect(
            formatDuration({
                duration: { hours: 1, minutes: 30 },
                locale: "en",
            }),
        ).toMatch(/30 minutes/);
        expect(
            formatDuration({
                duration: { hours: 1, minutes: 2, seconds: 3 },
                style: "digital",
            }),
        ).toBe("01:02:03");
        expect(formatDuration({ duration: {}, locale: "en" })).toMatch(/0/);
    });
});
