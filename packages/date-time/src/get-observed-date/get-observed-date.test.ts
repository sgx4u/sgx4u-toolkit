import { describe, expect, it } from "vitest";
import { getObservedDate } from "../index.js";

const independenceDay = { year: 2026, month: 7, day: 4 };

describe("getObservedDate", () => {
    it("moves Saturday 4 July 2026 to Friday", () => {
        expect(
            getObservedDate({
                date: independenceDay,
                policy: "nearest-weekday",
            }),
        ).toEqual({
            year: 2026,
            month: 7,
            day: 3,
        });
    });

    it("leaves a weekday in place and moves a weekend by the chosen policy", () => {
        expect(
            getObservedDate({
                date: { year: 2026, month: 7, day: 3 },
                policy: "nearest-weekday",
            }),
        ).toEqual({ year: 2026, month: 7, day: 3 });
        expect(
            getObservedDate({ date: independenceDay, policy: "none" }),
        ).toEqual(independenceDay);
        expect(
            getObservedDate({
                date: independenceDay,
                policy: "next-weekday",
            }),
        ).toEqual({
            year: 2026,
            month: 7,
            day: 6,
        });
        expect(
            getObservedDate({
                date: independenceDay,
                policy: "next-monday",
            }),
        ).toEqual({
            year: 2026,
            month: 7,
            day: 6,
        });
        expect(
            getObservedDate({
                date: { year: 2026, month: 7, day: 5 },
                policy: "nearest-weekday",
            }),
        ).toEqual({ year: 2026, month: 7, day: 6 });
        expect(
            getObservedDate({
                date: { year: 2022, month: 1, day: 1 },
                policy: "nearest-weekday",
            }),
        ).toEqual({ year: 2021, month: 12, day: 31 });
    });

    it("rejects an unknown policy or a date that is not a calendar date", () => {
        expect(() =>
            getObservedDate({
                date: independenceDay,
                policy: "weekend" as never,
            }),
        ).toThrow(RangeError);
        expect(() =>
            getObservedDate({
                date: { year: 2026, month: 7, day: 4.5 },
                policy: "none",
            }),
        ).toThrow(TypeError);
        expect(() =>
            getObservedDate({ date: null as never, policy: "none" }),
        ).toThrow("`date`");
    });

    it("treats non-working days as the weekend", () => {
        expect(
            getObservedDate({
                date: independenceDay,
                policy: "nearest-weekday",
            }),
        ).toEqual(
            getObservedDate({
                date: independenceDay,
                policy: "nearest-weekday",
                workingDays: [1, 2, 3, 4, 5],
            }),
        );
        expect(
            getObservedDate({
                date: { year: 2026, month: 7, day: 3 },
                policy: "nearest-weekday",
                workingDays: [1, 2, 3, 4, 7],
            }),
        ).toEqual({ year: 2026, month: 7, day: 2 });
    });
});