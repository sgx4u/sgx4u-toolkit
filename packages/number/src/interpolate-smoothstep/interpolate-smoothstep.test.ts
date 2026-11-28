import { describe, expect, it } from "vitest";
import { interpolateSmoothstep } from "../index.js";

describe("interpolateSmoothstep", () => {
    it("covers the documented behavior", () => {
        expect(interpolateSmoothstep({ start: 0, end: 10, amount: 0 })).toBe(0);
        expect(interpolateSmoothstep({ start: 0, end: 10, amount: 1 })).toBe(
            10,
        );
        expect(interpolateSmoothstep({ start: 0, end: 10, amount: 0.5 })).toBe(
            5,
        );
        expect(interpolateSmoothstep({ start: 0, end: 10, amount: 2 })).toBe(
            10,
        );
    });
});
