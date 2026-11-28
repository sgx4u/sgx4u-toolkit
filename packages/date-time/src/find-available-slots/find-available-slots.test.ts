import { describe, expect, it } from "vitest";
import { findAvailableSlots } from "../index.js";

describe("findAvailableSlots", () => {
    it("skips a busy block and stays inside a daily window", () => {
        const slots = findAvailableSlots({
            busy: [{ start: new Date(10), end: new Date(20) }],
            within: { start: new Date(0), end: new Date(40) },
            slotDuration: { milliseconds: 10 },
            timeZone: "UTC",
        });
        expect(
            (slots ?? []).map((slot) => [
                slot.start.getTime(),
                slot.end.getTime(),
            ]),
        ).toEqual([
            [0, 10],
            [20, 30],
            [30, 40],
        ]);
        const windowed = findAvailableSlots({
            busy: [],
            within: {
                start: new Date("2026-11-26T08:00:00Z"),
                end: new Date("2026-11-26T18:00:00Z"),
            },
            slotDuration: { hours: 1 },
            dailyWindow: { start: "09:00", end: "17:00" },
            timeZone: "UTC",
        });
        expect(windowed).toBeDefined();
        expect(windowed![0]?.start.toISOString()).toBe(
            "2026-11-26T09:00:00.000Z",
        );
        expect(windowed!.at(-1)?.end.toISOString()).toBe(
            "2026-11-26T17:00:00.000Z",
        );
    });
});
