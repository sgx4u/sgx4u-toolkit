import { describe, expect, it } from "vitest";
import { createSeededRandom } from "../index.js";

describe("createSeededRandom", () => {
    it("covers the documented behavior", () => {
        const first = createSeededRandom({ seed: "toolkit" });
        const second = createSeededRandom({ seed: "toolkit" });
        expect(first.random()).toBe(second.random());
        expect(first.randomInteger({ lower: 1, upper: 10 })).toBe(
            second.randomInteger({ lower: 1, upper: 10 }),
        );
        expect(first.randomNumber({ lower: 0, upper: 1 })).toBe(
            second.randomNumber({ lower: 0, upper: 1 }),
        );
        expect(() => createSeededRandom({ seed: Number.NaN })).toThrow(
            RangeError,
        );
    });
});
