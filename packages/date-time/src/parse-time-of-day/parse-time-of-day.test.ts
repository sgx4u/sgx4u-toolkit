import { describe, expect, it } from "vitest";
import { parseTimeOfDay } from "../index.js";

describe("parseTimeOfDay", () => {
    it("parses 24-hour and 12-hour text and rejects 24:00", () => {
        expect(parseTimeOfDay("09:30")).toEqual({
            hour: 9,
            minute: 30,
            second: 0,
            millisecond: 0,
        });
        expect(parseTimeOfDay("21:30:15.250")).toEqual({
            hour: 21,
            minute: 30,
            second: 15,
            millisecond: 250,
        });
        expect(parseTimeOfDay("9:30 pm")).toEqual({
            hour: 21,
            minute: 30,
            second: 0,
            millisecond: 0,
        });
        expect(parseTimeOfDay("12:00 a.m.")).toEqual({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
        });
        expect(parseTimeOfDay("24:00")).toBeUndefined();
        expect(parseTimeOfDay("nope")).toBeUndefined();
        expect(() => parseTimeOfDay(9 as unknown as string)).toThrow(TypeError);
    });
});
