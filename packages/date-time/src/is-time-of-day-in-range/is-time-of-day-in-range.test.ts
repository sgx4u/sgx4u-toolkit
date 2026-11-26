import { describe, expect, it } from "vitest";
import {
    compareTimesOfDay,
    getTimeOfDay,
    isTimeOfDayInRange,
} from "../index.js";

const evening = { hour: 23, minute: 0, second: 0, millisecond: 0 };
const morning = { hour: 5, minute: 0, second: 0, millisecond: 0 };
const noon = { hour: 12, minute: 0, second: 0, millisecond: 0 };

describe("times of day", () => {
    it("orders times and treats an overnight range as continuous", () => {
        expect(compareTimesOfDay(morning, evening)).toBe(-1);
        expect(
            isTimeOfDayInRange(evening, { start: "22:00", end: "06:00" }),
        ).toBe(true);
        expect(
            isTimeOfDayInRange(morning, { start: "22:00", end: "06:00" }),
        ).toBe(true);
        expect(isTimeOfDayInRange(noon, { start: "22:00", end: "06:00" })).toBe(
            false,
        );
        expect(
            getTimeOfDay({ date: "2026-11-25T22:00:00.000Z", timeZone: "Asia/Kolkata", }),
        ).toEqual({ hour: 3, minute: 30, second: 0, millisecond: 0 });
    });
});
