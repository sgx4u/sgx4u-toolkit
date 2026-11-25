import { describe, expect, it } from "vitest";
import {
    findDatesInText,
    parseNaturalDate,
    parseNaturalDateRange,
} from "../natural-language.js";

const now = { now: "2026-11-26T12:00:00Z", timeZone: "UTC" };

describe("natural language", () => {
    it("reads relative days, weekdays, month names, and ranges", () => {
        expect(parseNaturalDate("tomorrow", now)?.toISOString()).toBe(
            "2026-11-27T00:00:00.000Z",
        );
        expect(parseNaturalDate("in 3 days", now)?.toISOString()).toBe(
            "2026-11-29T12:00:00.000Z",
        );
        expect(parseNaturalDate("next Friday at 4pm", now)?.toISOString()).toBe(
            "2026-12-04T16:00:00.000Z",
        );
        expect(parseNaturalDate("Dec 25", now)?.toISOString()).toBe(
            "2026-12-25T00:00:00.000Z",
        );
        expect(
            parseNaturalDate("Dec 25", {
                ...now,
                preferFuture: false,
                now: "2026-12-26T00:00:00Z",
            })?.toISOString(),
        ).toBe("2026-12-25T00:00:00.000Z");
        expect(parseNaturalDate("not a date", now)).toBeUndefined();
        expect(
            parseNaturalDateRange(
                "from Monday to Wednesday",
                now,
            )?.end.toISOString(),
        ).toBe("2026-12-03T00:00:00.000Z");
        expect(
            parseNaturalDateRange("this weekend", now)?.start.toISOString(),
        ).toBe("2026-11-28T00:00:00.000Z");
        expect(findDatesInText("no dates here", now)).toEqual([]);
        expect(
            findDatesInText("See you tomorrow", now)[0]?.start.toISOString(),
        ).toBe("2026-11-27T00:00:00.000Z");
    });
});
