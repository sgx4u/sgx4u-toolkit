import { describe, expect, it } from "vitest";
import { sumPrecise } from "../index.js";

describe("sumPrecise", () => {
    it("covers the documented behavior", () => {
        expect(sumPrecise([])).toBe(0);
        expect(sumPrecise([1e20, 0.1, -1e20])).toBe(0.1);
        expect(sumPrecise([0.1, 0.2])).toBe(0.1 + 0.2);
        expect(Object.is(sumPrecise([-0]), -0)).toBe(true);
        expect(sumPrecise([Number.NaN])).toBeUndefined();
        const math = Math as Math & {
            sumPrecise?: (items: Iterable<number>) => number;
        };
        const original = math.sumPrecise;
        math.sumPrecise = (items) =>
            [...items].reduce((total, value) => total + value, 0);
        expect(sumPrecise([1, 2, 3])).toBe(6);
        if (original === undefined) {
            delete math.sumPrecise;
        } else {
            math.sumPrecise = original;
        }
    });
});
