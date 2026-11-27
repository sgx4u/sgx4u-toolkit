import { describe, expect, it } from "vitest";
import { interpolateAngle } from "../index.js";

describe("interpolateAngle", () => {
    it("covers the documented behavior", () => {
        expect(
            interpolateAngle({
                start: 350,
                end: 10,
                amount: 0.5,
                unit: "degrees",
            }),
        ).toBe(360);
        expect(interpolateAngle({ start: 0, end: Math.PI, amount: 0 })).toBe(0);
        expect(() =>
            interpolateAngle({
                start: 0,
                end: 1,
                amount: 0,
                unit: "turns" as "radians",
            }),
        ).toThrow(RangeError);
    });
});
