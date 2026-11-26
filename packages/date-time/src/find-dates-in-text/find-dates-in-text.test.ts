import { describe, expect, it } from "vitest";
import { findDatesInText } from "../natural-language.js";

const now = "2026-11-26T12:00:00Z";

describe("findDatesInText", () => {
    it("finds tomorrow and a weekday range from the supplied now", () => {
        const tomorrow = findDatesInText({
            text: "See you tomorrow",
            now,
            timeZone: "UTC",
        });
        expect(tomorrow[0]?.text).toBe("tomorrow");
        expect(tomorrow[0]?.index).toBe(8);
        expect(tomorrow[0]?.start.toISOString()).toBe(
            "2026-11-27T00:00:00.000Z",
        );
        const range = findDatesInText({
            text: "from Monday to Wednesday",
            now,
            timeZone: "UTC",
        });
        expect(range[0]?.start.toISOString()).toBe("2026-11-30T00:00:00.000Z");
        expect(range[0]?.end?.toISOString()).toBe("2026-12-03T00:00:00.000Z");
    });

    it("finds leap day and New Year's Day, and prefers a future month-day by default", () => {
        const found = findDatesInText({
            text: "On 2024-02-29. On 2025-01-01.",
            now: "2024-01-01T00:00:00Z",
            timeZone: "UTC",
        });
        expect(found.map((match) => match.text)).toEqual([
            "2024-02-29",
            "2025-01-01",
        ]);
        expect(found.map((match) => match.start.toISOString())).toEqual([
            "2024-02-29T00:00:00.000Z",
            "2025-01-01T00:00:00.000Z",
        ]);
        expect(
            findDatesInText({
                text: "Dec 25",
                now: "2026-12-26T00:00:00Z",
                timeZone: "UTC",
            })[0]?.start.toISOString(),
        ).toBe("2027-12-25T00:00:00.000Z");
        expect(
            findDatesInText({
                text: "Dec 25",
                now: "2026-12-26T00:00:00Z",
                timeZone: "UTC",
                preferFuture: false,
            })[0]?.start.toISOString(),
        ).toBe("2026-12-25T00:00:00.000Z");
    });

    it("places March 10 and March 11 at the Eastern offset around the spring-forward", () => {
        const found = findDatesInText({
            text: "Visit 2024-03-10. Leave 2024-03-11.",
            now: "2024-01-01T00:00:00Z",
            timeZone: "America/New_York",
        });
        expect(found.map((match) => match.start.toISOString())).toEqual([
            "2024-03-10T05:00:00.000Z",
            "2024-03-11T04:00:00.000Z",
        ]);
    });

    it("returns an empty list for prose without a date and rejects a non-string", () => {
        expect(
            findDatesInText({ text: "no dates here", now, timeZone: "UTC" }),
        ).toEqual([]);
        expect(() => findDatesInText({ text: 1 as unknown as string })).toThrow(
            TypeError,
        );
        expect(() => findDatesInText({ text: 1 as unknown as string })).toThrow(
            "`text` must be a string; received 1.",
        );
        expect(
            findDatesInText({ text: "tomorrow", now: "nope", timeZone: "UTC" }),
        ).toEqual([]);
    });
});
