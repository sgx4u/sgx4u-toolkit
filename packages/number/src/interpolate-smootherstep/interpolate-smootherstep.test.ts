import { describe, expect, it } from "vitest";
import { interpolateSmootherstep } from "../index.js";

describe("interpolateSmootherstep", () => {
    it("covers the documented behavior", () => {
        expect(interpolateSmootherstep({ start: 0, end: 10, amount: 0 })).toBe(
            0,
        );
        expect(interpolateSmootherstep({ start: 0, end: 10, amount: 1 })).toBe(
            10,
        );
        expect(
            interpolateSmootherstep({ start: 0, end: 10, amount: 0.5 }),
        ).toBe(5);
    });
});
