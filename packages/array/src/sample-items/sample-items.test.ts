import { describe, expect, it } from "vitest";
import { sampleItems } from "./sample-items.js";

describe("sampleItems", () => {
    it("returns undefined when array is not an array", () => {
        expect(sampleItems(undefined as never)).toBeUndefined();
        expect(sampleItems({ array: "no", count: 1 } as never)).toBeUndefined();
        expect(sampleItems([1, 2, 3] as never)).toBeUndefined();
    });

    it("returns an empty array when count is 0", () => {
        const values = Object.freeze([1, 2, 3]);
        expect(sampleItems({ array: values, count: 0 })).toEqual([]);
        expect(values).toEqual([1, 2, 3]);
    });

    it("returns a new array whose length is count", () => {
        const values = [1, 2, 3, 4, 5, 6];
        const sample = sampleItems({ array: values, count: 3, seed: 5 });
        expect(sample).toHaveLength(3);
        expect(sample).not.toBe(values);
        expect(new Set(sample).size).toBe(3);
        for (const item of sample ?? []) {
            expect(values).toContain(item);
        }
        expect(values).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("repeats the same sample for the same seed", () => {
        const values = [1, 2, 3, 4, 5];
        expect(sampleItems({ array: values, count: 4, seed: 9 })).toEqual(
            sampleItems({ array: values, count: 4, seed: 9 }),
        );
    });

    it("can return every item when count equals the length", () => {
        const values = [1, 2, 3];
        const sample = sampleItems({
            array: values,
            count: values.length,
            seed: 1,
        });
        expect([...(sample ?? [])].sort((left, right) => left - right)).toEqual(
            [1, 2, 3],
        );
    });

    it("throws when count is greater than the length", () => {
        expect(() => sampleItems({ array: [1, 2], count: 3 })).toThrow(
            RangeError,
        );
        expect(() => sampleItems({ array: [1, 2], count: 3 })).toThrow(
            "`count` must be less than or equal to the array length 2; received 3.",
        );
    });

    it("throws when count is not a non-negative integer", () => {
        expect(() => sampleItems({ array: [1], count: -1 })).toThrow(
            RangeError,
        );
        expect(() => sampleItems({ array: [1], count: 1.5 })).toThrow(
            RangeError,
        );
        expect(() => sampleItems({ array: [1], count: "1" as never })).toThrow(
            TypeError,
        );
    });

    it("treats a sparse hole as undefined", () => {
        const values: number[] = [];
        values[0] = 1;
        values[2] = 3;
        const sample = sampleItems({ array: values, count: 3, seed: 2 });
        expect(sample).toHaveLength(3);
        expect(sample).toContain(undefined);
    });
});
