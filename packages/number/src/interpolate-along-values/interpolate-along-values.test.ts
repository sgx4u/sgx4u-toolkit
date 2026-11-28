import { describe, expect, it } from "vitest";
import { interpolateAlongValues } from "../index.js";

describe("interpolateAlongValues", () => {
    it("covers the documented behavior", () => {
        expect(interpolateAlongValues({ values: [0, 10, 30], amount: 0 })).toBe(
            0,
        );
        expect(interpolateAlongValues({ values: [0, 10, 30], amount: 1 })).toBe(
            30,
        );
        expect(
            interpolateAlongValues({ values: [0, 10, 30], amount: 0.5 }),
        ).toBe(10);
        expect(
            interpolateAlongValues({ values: [1], amount: 0.5 }),
        ).toBeUndefined();
        expect(
            interpolateAlongValues({ values: [0, Number.NaN], amount: 0.5 }),
        ).toBeUndefined();
    });
});
