import { describe, expect, it } from "vitest";
import { randomGaussian } from "../index.js";

describe("randomGaussian", () => {
    it("covers the documented behavior", () => {
        const samples = [0.2, 0.8];
        let index = 0;
        const value = randomGaussian({ random: () => samples[index++] ?? 0.2 });
        expect(value).toEqual(expect.any(Number));
        expect(
            randomGaussian({ standardDeviation: 0, random: () => 0.5 }),
        ).toBeUndefined();
        expect(
            randomGaussian({ standardDeviation: -1, random: () => 0.5 }),
        ).toBeUndefined();
    });
});
