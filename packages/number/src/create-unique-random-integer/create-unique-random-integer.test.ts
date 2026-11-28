import { describe, expect, it } from "vitest";
import { createUniqueRandomInteger } from "../index.js";

describe("createUniqueRandomInteger", () => {
    it("covers the documented behavior", () => {
        const next = createUniqueRandomInteger({
            lower: 1,
            upper: 2,
            random: () => 0,
        });
        const first = next();
        const second = next();
        expect([first, second].sort()).toEqual([1, 2]);
        expect([1, 2]).toContain(next());
        expect(() =>
            createUniqueRandomInteger({ lower: 3, upper: 1, random: () => 0 }),
        ).toThrow(RangeError);
    });
});
