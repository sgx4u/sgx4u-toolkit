import { describe, expect, it } from "vitest";
import { getObservedDate } from "../index.js";

const independenceDay = { year: 2026, month: 7, day: 4 };

describe("getObservedDate", () => {
    it("moves Saturday 4 July 2026 to Friday", () => {
        expect(getObservedDate(independenceDay, "nearest-weekday")).toEqual({
            year: 2026,
            month: 7,
            day: 3,
        });
    });

    it("leaves a weekday in place and moves a weekend by the chosen policy", () => {
        expect(
            getObservedDate(
                { year: 2026, month: 7, day: 3 },
                "nearest-weekday",
            ),
        ).toEqual({ year: 2026, month: 7, day: 3 });
        expect(getObservedDate(independenceDay, "none")).toEqual(
            independenceDay,
        );
        expect(getObservedDate(independenceDay, "next-weekday")).toEqual({
            year: 2026,
            month: 7,
            day: 6,
        });
        expect(getObservedDate(independenceDay, "next-monday")).toEqual({
            year: 2026,
            month: 7,
            day: 6,
        });
        expect(
            getObservedDate(
                { year: 2026, month: 7, day: 5 },
                "nearest-weekday",
            ),
        ).toEqual({ year: 2026, month: 7, day: 6 });
        expect(
            getObservedDate(
                { year: 2022, month: 1, day: 1 },
                "nearest-weekday",
            ),
        ).toEqual({ year: 2021, month: 12, day: 31 });
    });

    it("rejects an unknown policy or a date that is not a calendar date", () => {
        expect(() =>
            getObservedDate(independenceDay, "weekend" as never),
        ).toThrow(RangeError);
        expect(() =>
            getObservedDate(independenceDay, "weekend" as never),
        ).toThrow("`policy`");
        expect(() =>
            getObservedDate({ year: 2026, month: 7, day: 4.5 }, "none"),
        ).toThrow(TypeError);
        expect(() =>
            getObservedDate({ year: 2026, month: 7, day: 4.5 }, "none"),
        ).toThrow("`date`");
        expect(() => getObservedDate(null as never, "none")).toThrow("`date`");
    });

    it("treats Saturday and Sunday as the weekend unless weekendDays says otherwise", () => {
        expect(getObservedDate(independenceDay, "nearest-weekday")).toEqual(
            getObservedDate(independenceDay, "nearest-weekday", {
                weekendDays: [6, 7],
            }),
        );
        expect(
            getObservedDate(
                { year: 2026, month: 7, day: 3 },
                "nearest-weekday",
                { weekendDays: [5, 6] },
            ),
        ).toEqual({ year: 2026, month: 7, day: 2 });
    });
});
