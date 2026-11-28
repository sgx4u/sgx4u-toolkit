import { describe, expect, it } from "vitest";
import { getStandardDeviation } from "../index.js";

describe("getStandardDeviation", () => {
    it("covers the documented behavior", () => {
        expect(
            getStandardDeviation({ values: [1, 2, 3], sample: false }),
        ).toBeCloseTo(Math.sqrt(2 / 3));
        expect(getStandardDeviation({ values: [1] })).toBeUndefined();
    });
});
