import { describe, expect, it } from "vitest";
import { parseNaturalDateRange } from "../natural-language.js";

const now = { now: "2026-11-26T12:00:00Z", timeZone: "UTC" };

function ends(
    text: string,
    options: {
        now: string;
        timeZone: string;
        preferFuture?: boolean;
    } = now,
): string[] | undefined {
    const range = parseNaturalDateRange(text, options);
    if (range === undefined) {
        return undefined;
    }
    return [range.start.toISOString(), range.end.toISOString()];
}

describe("parseNaturalDateRange", () => {
    it("reads next week, this weekend, and a weekday span", () => {
        expect(ends("next week")).toEqual([
            "2026-11-30T00:00:00.000Z",
            "2026-12-07T00:00:00.000Z",
        ]);
        expect(ends("this week")).toEqual([
            "2026-11-23T00:00:00.000Z",
            "2026-11-30T00:00:00.000Z",
        ]);
        expect(ends("this weekend")).toEqual([
            "2026-11-28T00:00:00.000Z",
            "2026-11-30T00:00:00.000Z",
        ]);
        expect(ends("next weekend")).toEqual([
            "2026-12-05T00:00:00.000Z",
            "2026-12-07T00:00:00.000Z",
        ]);
        expect(ends("from Monday to Wednesday")).toEqual([
            "2026-11-30T00:00:00.000Z",
            "2026-12-03T00:00:00.000Z",
        ]);
    });

    it("reads a month span, including leap day, and prefers the future by default", () => {
        expect(ends("Dec 24-26")).toEqual([
            "2026-12-24T00:00:00.000Z",
            "2026-12-27T00:00:00.000Z",
        ]);
        expect(ends("jan 30-31")).toEqual([
            "2027-01-30T00:00:00.000Z",
            "2027-02-01T00:00:00.000Z",
        ]);
        expect(
            ends("feb 28-29", {
                now: "2024-02-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toEqual(["2024-02-28T00:00:00.000Z", "2024-03-01T00:00:00.000Z"]);
        expect(
            ends("feb 28-29 2024", {
                now: "2026-11-26T12:00:00Z",
                timeZone: "UTC",
            }),
        ).toEqual(["2024-02-28T00:00:00.000Z", "2024-03-01T00:00:00.000Z"]);
        expect(
            ends("feb 28-29", {
                now: "2023-02-01T00:00:00Z",
                timeZone: "UTC",
            }),
        ).toBeUndefined();
        expect(
            ends("Dec 24-26", {
                now: "2026-01-01T00:00:00Z",
                timeZone: "UTC",
                preferFuture: false,
            }),
        ).toEqual(["2025-12-24T00:00:00.000Z", "2025-12-27T00:00:00.000Z"]);
    });

    it("uses local midnights, including a daylight-saving week", () => {
        expect(
            ends("next week", {
                now: "2026-11-26T12:00:00Z",
                timeZone: "Asia/Kolkata",
            }),
        ).toEqual(["2026-11-29T18:30:00.000Z", "2026-12-06T18:30:00.000Z"]);
        expect(
            ends("this weekend", {
                now: "2024-03-10T06:00:00Z",
                timeZone: "America/New_York",
            }),
        ).toEqual(["2024-03-09T05:00:00.000Z", "2024-03-11T04:00:00.000Z"]);
        expect(
            ends("this week", {
                now: "2026-11-30T03:00:00Z",
                timeZone: "America/New_York",
            }),
        ).toEqual(["2026-11-23T05:00:00.000Z", "2026-11-30T05:00:00.000Z"]);
        expect(
            ends("this week", {
                now: "2026-11-30T03:00:00Z",
                timeZone: "UTC",
            }),
        ).toEqual(["2026-11-30T00:00:00.000Z", "2026-12-07T00:00:00.000Z"]);
    });

    it("returns undefined for a single day or unrecognized text", () => {
        expect(ends("")).toBeUndefined();
        expect(ends("   ")).toBeUndefined();
        expect(ends("tomorrow")).toBeUndefined();
        expect(ends("not a range")).toBeUndefined();
        expect(ends("from Monday to nowhere")).toBeUndefined();
    });

    it("throws TypeError when the text is not a string", () => {
        expect(() =>
            parseNaturalDateRange(1 as unknown as string, now),
        ).toThrow(TypeError);
        expect(() =>
            parseNaturalDateRange(null as unknown as string, now),
        ).toThrow("`text` must be a string; received null.");
        expect(() =>
            parseNaturalDateRange({ text: "next week", ...{ timeZone: "Mars/Base" } }),
        ).toThrow(RangeError);
    });
});
