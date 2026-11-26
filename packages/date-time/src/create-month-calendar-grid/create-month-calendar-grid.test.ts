import { describe, expect, it } from "vitest";
import { createMonthCalendarGrid } from "../index.js";

describe("createMonthCalendarGrid", () => {
    it("covers February 2021 in four Monday-start weeks", () => {
        const grid = createMonthCalendarGrid(2021, 2, { timeZone: "UTC" });
        expect(grid).toMatchObject({ year: 2021, month: 2 });
        expect(grid.weeks).toHaveLength(4);
        expect(grid.weeks[0]?.days[0]?.isInMonth).toBe(true);
        expect(grid.weeks[0]?.days[0]?.date.toISOString()).toBe(
            "2021-02-01T00:00:00.000Z",
        );
        expect(
            createMonthCalendarGrid(2021, 2, {
                timeZone: "UTC",
                weekStartsOn: 1,
            }).weeks,
        ).toHaveLength(4);
    });

    it("includes 29 February 2024 and pads the grid to six weeks when asked", () => {
        const grid = createMonthCalendarGrid(2024, 2, { timeZone: "UTC" });
        expect(grid.weeks).toHaveLength(5);
        const days = grid.weeks.flatMap((week) => week.days);
        expect(days[0]?.date.toISOString()).toBe("2024-01-29T00:00:00.000Z");
        expect(days[0]?.isInMonth).toBe(false);
        expect(
            days.find(
                (day) => day.date.toISOString() === "2024-02-29T00:00:00.000Z",
            )?.isInMonth,
        ).toBe(true);
        expect(
            createMonthCalendarGrid(2024, 2, {
                timeZone: "UTC",
                fixedWeekCount: true,
            }).weeks,
        ).toHaveLength(6);
        const kolkata = createMonthCalendarGrid(2024, 2, {
            timeZone: "Asia/Kolkata",
        })
            .weeks.flatMap((week) => week.days)
            .filter((day) => day.isInMonth);
        expect(kolkata[kolkata.length - 1]?.date.toISOString()).toBe(
            "2024-02-28T18:30:00.000Z",
        );
    });

    it("starts March days at the Eastern offset, including the spring-forward Sunday", () => {
        const days = createMonthCalendarGrid(2024, 3, {
            timeZone: "America/New_York",
        }).weeks.flatMap((week) => week.days);
        expect(
            days
                .find((day) => day.date.toISOString().startsWith("2024-03-10"))
                ?.date.toISOString(),
        ).toBe("2024-03-10T05:00:00.000Z");
        expect(
            days
                .find((day) => day.date.toISOString().startsWith("2024-03-11"))
                ?.date.toISOString(),
        ).toBe("2024-03-11T04:00:00.000Z");
        expect(
            createMonthCalendarGrid(2024, 3, {
                timeZone: "UTC",
            }).weeks[0]?.days[0]?.date.toISOString(),
        ).toBe("2024-02-26T00:00:00.000Z");
    });

    it("rejects a month outside 1 through 12 and a week start that is not a weekday", () => {
        expect(() => createMonthCalendarGrid(2024, 0)).toThrow(RangeError);
        expect(() => createMonthCalendarGrid(2024, 0)).toThrow(
            "`month` must be an integer from 1 to 12; received 0.",
        );
        expect(() => createMonthCalendarGrid(2024.5, 2)).toThrow(
            "`year` must be an integer; received 2024.5.",
        );
        expect(() =>
            createMonthCalendarGrid(2024, 2, { weekStartsOn: 8 as 1 }),
        ).toThrow(RangeError);
    });
});
