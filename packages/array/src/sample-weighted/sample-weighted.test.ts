import { describe, expect, it } from "vitest";
import { sampleWeighted } from "./sample-weighted.js";

describe("sampleWeighted", () => {
    it("returns undefined when every weight is 0", () => {
        expect(
            sampleWeighted({
                array: [1, 2, 3],
                weight: () => 0,
            }),
        ).toBeUndefined();
        expect(
            sampleWeighted({
                array: [],
                weight: () => 1,
            }),
        ).toBeUndefined();
    });

    it("returns undefined when array is not an array", () => {
        expect(
            sampleWeighted({ array: "no", weight: () => 1 } as never),
        ).toBeUndefined();
        expect(sampleWeighted(undefined as never)).toBeUndefined();
    });

    it("throws when a weight is negative", () => {
        expect(() =>
            sampleWeighted({
                array: [1, 2],
                weight: (item: number) => (item === 1 ? 1 : -2),
            }),
        ).toThrow(RangeError);
        expect(() =>
            sampleWeighted({
                array: [1],
                weight: () => -2,
            }),
        ).toThrow(
            "`weight` must return a finite number greater than or equal to 0; received -2.",
        );
    });

    it("throws when a weight is not finite", () => {
        expect(() =>
            sampleWeighted({
                array: [1],
                weight: () => Number.POSITIVE_INFINITY,
            }),
        ).toThrow(RangeError);
    });

    it("returns an empty array when count is 0", () => {
        expect(
            sampleWeighted({
                array: [1, 2],
                weight: () => 1,
                count: 0,
            }),
        ).toEqual([]);
        expect(
            sampleWeighted({
                array: [1],
                weight: () => 0,
                count: 0,
            }),
        ).toEqual([]);
    });

    it("draws without replacement in proportion to the weight", () => {
        const values = Object.freeze(["a", "b", "c"]);
        const sequence = [0, 0.9];
        let cursor = 0;
        const sample = sampleWeighted({
            array: values,
            weight: (item: string) => (item === "b" ? 0 : 1),
            count: 2,
            random: () => {
                const value = sequence[cursor] ?? 0;
                cursor += 1;
                return value;
            },
        });
        expect(sample).toEqual(["a", "c"]);
        expect(sample).not.toBe(values);
        expect(values).toEqual(["a", "b", "c"]);
    });

    it("keeps weights when replacement is true", () => {
        const sample = sampleWeighted({
            array: ["a", "b"],
            weight: (item: string) => (item === "a" ? 1 : 0),
            count: 3,
            replacement: true,
            random: () => 0,
        });
        expect(sample).toEqual(["a", "a", "a"]);
    });

    it("throws when count exceeds the positive weights", () => {
        expect(() =>
            sampleWeighted({
                array: ["a", "b", "c"],
                weight: (item: string) => (item === "b" ? 0 : 1),
                count: 3,
            }),
        ).toThrow(RangeError);
        expect(() =>
            sampleWeighted({
                array: ["a", "b", "c"],
                weight: (item: string) => (item === "b" ? 0 : 1),
                count: 3,
            }),
        ).toThrow(
            "`count` must be less than or equal to the number of items with a positive weight (2); received 3.",
        );
    });

    it("reads a weight from a property key", () => {
        const sample = sampleWeighted({
            array: [{ name: "a", mass: 1 }],
            weight: "mass",
            seed: 1,
        });
        expect(sample).toEqual([{ name: "a", mass: 1 }]);
    });

    it("repeats the same draw for the same seed", () => {
        const params = {
            array: ["a", "b", "c"],
            weight: (item: string) => (item === "c" ? 5 : 1),
            count: 2,
            seed: 4,
        };
        expect(sampleWeighted(params)).toEqual(sampleWeighted(params));
    });

    it("throws when weight or count is the wrong type", () => {
        expect(() =>
            sampleWeighted({ array: [1], weight: {} as never }),
        ).toThrow(TypeError);
        expect(() =>
            sampleWeighted({ array: [1], weight: () => 1, count: -1 }),
        ).toThrow(RangeError);
    });

    it("treats a sparse hole as undefined", () => {
        const values: number[] = [];
        values[0] = 1;
        values[2] = 3;
        const sample = sampleWeighted({
            array: values,
            weight: () => 1,
            count: 3,
            seed: 1,
        });
        expect(sample).toHaveLength(3);
        expect(sample).toContain(undefined);
    });
});
